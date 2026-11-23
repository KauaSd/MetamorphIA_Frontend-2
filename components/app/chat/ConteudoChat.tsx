"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import ChatTgAluno from "@/components/app/chat/ChatTgAluno";
import Conteudopei from "@/components/app/pei/Conteudopei";
import EditaPEI from "@/components/app/chat/EditaPEI";
import GeraPEI from "@/components/app/chat/GeraPEI";
import ChatInput from "@/components/app/pei/ChatInput";
import CarregandoDashboard from "@/components/app/layout/CarregandoDashboard";
import Toast, { useAlerta } from "@/components/common/Toast";

import { useData } from "@/components/app/state/DataProvider";
import { primeiraNeuro, resolverChat, type AnexoMensagem } from "@/utils/data/types";
import { addMessage, openChatWith } from "@/utils/data/controller";
import { ALERTAS } from "@/utils/alertas";
import {
  apiAiGatewayOrDirect,
  baixarArquivoDeAnexo,
  getSavedUserProfile,
  parseNumeroId,
} from "@/utils/apiClient";
import type { Anexo } from "@/utils/pei/types";

type OpcaoAdaptacao = {
  titulo?: string;
  label?: string;
  descricao?: string;
  modo_adaptacao?: string;
  template_id?: string;
  formato_saida?: string;
};

// o mesmo formato de Mensagem do store, mais um id local para a lista nao
// embaralhar enquanto o stream ainda corre
type Bolha = {
  id: string;
  texto: string;
  autor: "professor" | "aluno";
  streaming?: boolean;
  anexos?: AnexoMensagem[];
  opcoesAdaptacao?: OpcaoAdaptacao[];
};

function Dots() {
  return (
    <span className="inline-flex gap-0.5">
      <span className="animate-[dot_1.4s_ease-in-out_infinite] text-3xl">.</span>
      <span className="animate-[dot_1.4s_0.2s_ease-in-out_infinite] text-3xl">.</span>
      <span className="animate-[dot_1.4s_0.4s_ease-in-out_infinite] text-3xl">.</span>
    </span>
  );
}

export default function ConteudoChat() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const conversaId = searchParams.get("conversaId");
  const alunoId = searchParams.get("alunoId");
  const deveAbrirPei = searchParams.get("gerarPei") === "true" || searchParams.get("pei") === "true";

  const { conversas, alunos, teacherName, hydrated, recarregar } = useData();
  const { alerta, mostrar, limpar } = useAlerta();

  // o que o stream esta escrevendo agora; o que ja foi salvo vem do store
  const [rascunho, setRascunho] = useState<Bolha[]>([]);
  const [ultimasOpcoes, setUltimasOpcoes] = useState<OpcaoAdaptacao[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [mostrarPainel, setMostrarPainel] = useState(deveAbrirPei);
  const [mostrarCriacao, setMostrarCriacao] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // regra: chat sem aluno nao existe. Antes da hidratacao os dados ainda estao
  // vazios, entao nada e decidido nesse meio-tempo
  const resolucao = useMemo(
    () => resolverChat(conversas, alunos, { conversaId, alunoId }),
    [conversas, alunos, conversaId, alunoId],
  );
  const semAluno = hydrated && resolucao.status === "sem-aluno";
  const aluno = resolucao.status === "ok" ? resolucao.aluno : undefined;
  const conversa = resolucao.status === "ok" ? resolucao.conversa : undefined;
  const precisaCriar = resolucao.status === "ok" && resolucao.precisaCriar;
  const idDoAluno = resolucao.status === "ok" ? resolucao.aluno.id : null;

  useEffect(() => {
    if (deveAbrirPei) {
      setMostrarPainel(true);
    }
  }, [deveAbrirPei]);

  useEffect(() => {
    if (semAluno) router.replace("/alunos");
  }, [semAluno, router]);

  // chegou pelo alunoId: a conversa nasce aqui e a URL vira canonica, para as
  // mensagens terem um conversaId para persistir
  useEffect(() => {
    if (!hydrated || !precisaCriar || !idDoAluno) return;
    let cancelado = false;

    (async () => {
      const resultado = await openChatWith(idDoAluno);
      await recarregar();
      if (cancelado) return;

      if (resultado.ok && resultado.conversaId) {
        router.replace(`/chat?conversaId=${resultado.conversaId}${deveAbrirPei ? "&gerarPei=true" : ""}`);
      } else if (!resultado.ok) {
        // so falha quando o aluno nao existe mais: ai o chat sai da rota
        mostrar(resultado.erro);
        router.replace("/alunos");
      }
    })();

    return () => {
      cancelado = true;
    };
  }, [hydrated, precisaCriar, idDoAluno, recarregar, router, mostrar]);

  // mensagens salvas + o que ainda esta em transito
  const bolhas: Bolha[] = [
    ...(conversa?.mensagens ?? []).map((mensagem) => ({
      id: mensagem.id,
      texto: mensagem.texto,
      autor: mensagem.autor,
      anexos: mensagem.anexos,
    })),
    ...rascunho,
  ];

  const hasStarted = bolhas.length > 0;

  // sair da pagina durante a resposta cancela o stream, senao ele continuaria
  // escrevendo em um componente que nao existe mais
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  /** grava no store; sem `conversaId` a conversa so vive nesta sessao */
  async function persistir(
    texto: string,
    autor: "professor" | "aluno",
    anexos?: AnexoMensagem[],
  ): Promise<boolean> {
    const idAlvo = conversaId ?? conversa?.id;
    if (!idAlvo) return false;
    const resultado = await addMessage(idAlvo, texto, autor, anexos, aluno?.id);
    if (!resultado.ok) {
      mostrar(resultado.erro);
      return false;
    }
    return true;
  }

  const handleConcluirPei = async (mensagemPei: string, anexosPei?: AnexoMensagem[]) => {
    setMostrarPainel(false);
    setMostrarCriacao(false);

    const idDoBot = `pei-${Date.now()}-bot`;
    setIsThinking(true);
    setUltimasOpcoes([]);
    setRascunho((prev) => [
      ...prev,
      { id: idDoBot, texto: "", autor: "aluno", streaming: true },
    ]);

    try {
      await new Promise((resolver) => setTimeout(resolver, 400));

      const persistiu = await persistir(mensagemPei, "aluno", anexosPei);
      if (persistiu) {
        await recarregar();
        setRascunho([]);
      } else {
        setRascunho((prev) =>
          prev.map((item) =>
            item.id === idDoBot
              ? { ...item, texto: mensagemPei, streaming: false, anexos: anexosPei }
              : item,
          ),
        );
      }
    } catch {
      setRascunho((prev) =>
        prev.map((item) =>
          item.id === idDoBot
            ? { ...item, texto: mensagemPei, streaming: false, anexos: anexosPei }
            : item,
        ),
      );
    } finally {
      setIsThinking(false);
    }
  };

  const handleSendMessage = async (
    texto: string,
    anexosEnviados?: Anexo[],
    opcoesExtras?: {
      modo_adaptacao?: string;
      template_id?: string;
      formato_saida?: string;
      gerar_arquivo_atividade?: boolean;
    },
  ) => {
    // sem conversa criada ainda nao ha onde persistir a mensagem
    if (!conversaId && !conversa?.id) return;

    const conteudo = texto.trim();
    const listaAnexos: AnexoMensagem[] = (anexosEnviados ?? []).map((a) => ({
      name: a.name,
      type: a.type || "application/octet-stream",
      size: a.size || 0,
      dataUrl: a.dataUrl,
    }));
    if (!conteudo && listaAnexos.length === 0) return;
    if (isThinking) return;

    const textoExibicao =
      conteudo || `📎 Arquivo enviado para adaptação: ${listaAnexos.map((a) => a.name).join(", ")}`;

    const idDaMinha = `enviada-${Date.now()}`;
    const idDoBot = `${idDaMinha}-bot`;

    setIsThinking(true);
    setUltimasOpcoes([]);
    setRascunho((prev) => [
      ...prev,
      {
        id: idDaMinha,
        texto: textoExibicao,
        autor: "professor",
        ...(listaAnexos.length > 0 ? { anexos: listaAnexos } : {}),
      },
      { id: idDoBot, texto: "", autor: "aluno", streaming: true },
    ]);

    const controller = new AbortController();
    abortRef.current = controller;

    let respostaCompleta = "";
    let anexosDaResposta: AnexoMensagem[] | undefined;
    let opcoesRetornadas: OpcaoAdaptacao[] | undefined;

    try {
      const numAluno = parseNumeroId(aluno?.id);
      const idConvAtual = conversaId ?? conversa?.id ?? null;
      const temAnexo = listaAnexos.length > 0;
      const querAdaptar = temAnexo || Boolean(opcoesExtras?.gerar_arquivo_atividade);
      const instrucoesIa = getSavedUserProfile()?.instrucoes_ia?.trim() || undefined;
      let respondeuViaApiAutenticada = false;

      if (numAluno !== null) {
        try {
          const dbRoute = querAdaptar
            ? `/AI/chat/aluno/${numAluno}/adaptar-atividade`
            : `/AI/chat/aluno/${numAluno}`;
          const iaRoute = querAdaptar
            ? `/alunos/${numAluno}/adaptar-atividade`
            : `/alunos/${numAluno}/chat`;

          const respApi = await apiAiGatewayOrDirect(dbRoute, iaRoute, {
            method: "POST",
            body: JSON.stringify({
              mensagem: conteudo,
              conversa_id: idConvAtual,
              anexos: temAnexo ? listaAnexos : undefined,
              gerar_arquivo_atividade: querAdaptar ? true : undefined,
              modo_adaptacao: opcoesExtras?.modo_adaptacao,
              template_id: opcoesExtras?.template_id,
              formato_saida: opcoesExtras?.formato_saida,
              instrucoes_ia: instrucoesIa,
            }),
            signal: controller.signal,
          });

          if (respApi.ok) {
            const dados = (await respApi.json()) as {
              resposta?: string;
              anexos?: AnexoMensagem[];
              atividade_id?: string | null;
              arquivo_nome?: string;
              formato_arquivo?: string | null;
              documento_docx_base64?: string;
              documento_pdf_base64?: string;
              opcoes_adaptacao?: OpcaoAdaptacao[] | null;
            };
            respostaCompleta = dados.resposta ?? "";
            if (Array.isArray(dados.opcoes_adaptacao) && dados.opcoes_adaptacao.length > 0) {
              opcoesRetornadas = dados.opcoes_adaptacao;
            }
            if (Array.isArray(dados.anexos) && dados.anexos.length > 0) {
              anexosDaResposta = dados.anexos;
            } else if (dados.documento_pdf_base64) {
              anexosDaResposta = [
                {
                  name: dados.arquivo_nome || "Atividade_Adaptada.pdf",
                  type: "application/pdf",
                  size: Math.round((dados.documento_pdf_base64.length * 3) / 4),
                  dataUrl: `data:application/pdf;base64,${dados.documento_pdf_base64}`,
                },
              ];
            } else if (dados.documento_docx_base64) {
              anexosDaResposta = [
                {
                  name: dados.arquivo_nome || "Atividade_Adaptada.docx",
                  type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  size: Math.round((dados.documento_docx_base64.length * 3) / 4),
                  dataUrl: `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${dados.documento_docx_base64}`,
                },
              ];
            } else if (dados.atividade_id) {
              const fmt = (dados.formato_arquivo || "docx").toLowerCase() === "pdf" ? "pdf" : "docx";
              try {
                const respArq = await apiAiGatewayOrDirect(
                  `/AI/atividades/aluno/${numAluno}/${dados.atividade_id}/${fmt}`,
                  `/alunos/${numAluno}/atividades/${dados.atividade_id}/${fmt}`,
                );
                if (respArq.ok) {
                  const blob = await respArq.blob();
                  const dataUrl = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(String(reader.result));
                    reader.readAsDataURL(blob);
                  });
                  anexosDaResposta = [
                    {
                      name: dados.arquivo_nome || `Atividade_Adaptada.${fmt}`,
                      type: blob.type || (fmt === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
                      size: blob.size,
                      dataUrl,
                    },
                  ];
                }
              } catch {}
            }
            respondeuViaApiAutenticada = true;
          }
        } catch {}
      }

      if (!respondeuViaApiAutenticada && temAnexo) {
        try {
          const respAdaptar = await apiAiGatewayOrDirect(
            "/AI/adaptar-atividade/arquivo",
            "/query/adaptar-atividade/arquivo",
            {
              method: "POST",
              body: JSON.stringify({
                atividade: conteudo,
                neurodivergencia: aluno ? primeiraNeuro(aluno) : "TEA",
                nome_aluno: aluno?.nome ?? "Estudante",
                anexos: listaAnexos,
                modo_adaptacao: opcoesExtras?.modo_adaptacao,
                template_id: opcoesExtras?.template_id,
                formato_saida: opcoesExtras?.formato_saida,
              }),
              signal: controller.signal,
            },
          );
          if (respAdaptar.ok) {
            const dados = (await respAdaptar.json()) as {
              adaptacoes_sugeridas?: string;
              anexo?: AnexoMensagem;
              arquivo_nome?: string;
              data_url?: string;
            };
            respostaCompleta = dados.adaptacoes_sugeridas ?? "";
            if (dados.anexo) {
              anexosDaResposta = [dados.anexo];
            } else if (dados.data_url) {
              anexosDaResposta = [
                {
                  name: dados.arquivo_nome || "Atividade_Adaptada.docx",
                  type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  size: 0,
                  dataUrl: dados.data_url,
                },
              ];
            }
            respondeuViaApiAutenticada = true;
          }
        } catch {}
      }

      if (!respondeuViaApiAutenticada) {
        throw new Error("Não foi possível obter resposta da API de IA.");
      }

      if (opcoesRetornadas && opcoesRetornadas.length > 0) {
        setUltimasOpcoes(opcoesRetornadas);
      }
      setRascunho((prev) =>
        prev.map((bolha) =>
          bolha.id === idDoBot
            ? {
                ...bolha,
                texto: respostaCompleta,
                anexos: anexosDaResposta,
              }
            : bolha,
        ),
      );

      await persistir(textoExibicao, "professor", listaAnexos.length > 0 ? listaAnexos : undefined);
      if (respostaCompleta.trim() || (anexosDaResposta && anexosDaResposta.length > 0)) {
        await persistir(respostaCompleta, "aluno", anexosDaResposta);
      }
    } catch (error) {
      if (controller.signal.aborted) return;

      console.error("Erro ao receber resposta:", error);

      await persistir(textoExibicao, "professor", listaAnexos.length > 0 ? listaAnexos : undefined);

      setRascunho((prev) =>
        prev.map((bolha) =>
          bolha.id === idDoBot
            ? { ...bolha, texto: "Não foi possível obter uma resposta da IA." }
            : bolha,
        ),
      );
      mostrar(ALERTAS.CHAT_IA_FALHOU);
    } finally {
      await recarregar();
      setRascunho([]);
      setIsThinking(false);
    }
  };

  // chat sem aluno nao existe: a rota so renderiza com aluno resolvido
  if (!hydrated) return <CarregandoDashboard mensagem="Carregando conversa..." />;
  if (semAluno) return null;

  // barra de escrita: fica sozinha no chat normal e entra dentro do painel de PEI
  const barra = (
    <ChatInput
      placeholder={hasStarted ? "" : "Digite uma mensagem..."}
      disabled={isThinking}
      enviarLabel="Enviar mensagem"
      onSubmit={handleSendMessage}
    />
  );

  // editar/gerar: dentro do painel quando ele esta aberto, no chat quando fechado
  const botoesPei = (
    <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:justify-center md:justify-end">
      <EditaPEI ativado={true} desabilitado={mostrarPainel} />
      <GeraPEI
        ativado={true}
        desabilitado={mostrarPainel}
        onClick={() => setMostrarPainel(true)}
      />
    </div>
  );

  return (
    // tela do chat
  <div className="relative flex h-screen w-full overflow-hidden p-4 sm:p-6 md:p-10">
    <div className="flex h-full flex-1 flex-col">
      <div className="flex w-full flex-col items-end">
        <ChatTgAluno
          nome={aluno?.nome ?? "Aluno"}
          neuro={aluno ? primeiraNeuro(aluno) : "—"}
        />
      </div>

        <div className="relative flex h-full flex-1 items-center justify-center px-2">
           <div
             className={`absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-700 ease-out ${
               hasStarted || mostrarPainel
                 ? "pointer-events-none top-[20%] -translate-y-8 opacity-0 scale-95"
                 : "opacity-100 scale-100"
             }`}
           >
             <p className="whitespace-nowrap text-center text-3xl sm:text-4xl md:text-5xl">
               {mostrarPainel ? "" : `Bom dia, Prof. ${teacherName ?? ""}`}
             </p>
           </div>

          {/* campo de mensagem e lista de conversa */}
          <div
            className={`absolute left-0 w-full px-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-8 md:px-5 lg:px-20 ${
              mostrarPainel
                 ? "inset-x-0 top-8 sm:top-12 bottom-0 flex flex-col"
                : hasStarted
                  ? "bottom-0"
                  : "top-[52%] -translate-y-1/2 opacity-100"
            }`}
          >
            <div
              className={`relative mx-auto flex w-full flex-col gap-6 h-full ${
              mostrarPainel ? "max-w-none h-full justify-center" : "max-w-[64rem]"
            }`}
            >
              {/* bolhas da conversa */}
              {hasStarted && (
                <div
                  className={`flex flex-col gap-4 overflow-y-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    mostrarPainel
                      ? "absolute left-0 right-0 top-0 z-10 w-full max-h-[55vh] opacity-0 translate-y-16 pointer-events-none"
                      : "relative max-h-[55vh] w-full opacity-100 translate-y-0"
                  }`}
                >
                  {bolhas.map((bolha) => (
                    <div
                      key={bolha.id}
                      className={`flex w-full ${
                        bolha.autor === "professor" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[75%] break-words rounded-t-[36px] px-6 py-4 ${
                          bolha.autor === "professor"
                            ? "rounded-bl-[36px] bg-sunken"
                            : "rounded-br-[36px] bg-surface-base"
                        }`}
                      >
                        {bolha.streaming && !bolha.texto && <Dots />}
                        <div className="flex flex-col gap-3 text-sm leading-relaxed sm:text-base">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children }) => (
                                <p className="whitespace-pre-line">{children}</p>
                              ),
                              ul: ({ children }) => (
                                <ul className="ml-5 flex list-disc flex-col gap-1 text-secondary">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="ml-5 flex list-decimal flex-col gap-1 text-secondary">
                                  {children}
                                </ol>
                              ),
                              li: ({ children }) => <li className="pl-1">{children}</li>,
                              strong: ({ children }) => (
                                <strong className="font-semibold text-primary">
                                  {children}
                                </strong>
                              ),
                              hr: () => <hr className="my-1 border-sunken" />,
                            }}
                          >
                            {bolha.texto}
                          </ReactMarkdown>
                          {bolha.anexos && bolha.anexos.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                              {bolha.anexos.map((anexo, idx) => (
                                <button
                                  key={`${anexo.name}-${idx}`}
                                  type="button"
                                  onClick={() => baixarArquivoDeAnexo(anexo)}
                                  className="flex cursor-pointer items-center gap-2 rounded-2xl bg-surface-warning/30 px-4 py-2 text-left text-xs font-medium text-primary transition-colors hover:bg-surface-warning/60 sm:text-sm"
                                >
                                  <span>📄 {anexo.name}</span>
                                  {anexo.dataUrl && (
                                    <span className="underline">Baixar</span>
                                  )}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {ultimasOpcoes.length > 0 && !isThinking && (
                    <div className="flex flex-wrap gap-2 pl-2">
                      {ultimasOpcoes.map((op, idx) => {
                        const rotulo =
                          op.titulo ||
                          op.label ||
                          (op.modo_adaptacao === "fiel"
                            ? "Adaptar fiel ao PDF"
                            : op.modo_adaptacao === "template"
                              ? "Usar template adaptado"
                              : `Opção ${idx + 1}`);
                        return (
                          <button
                            key={`${rotulo}-${idx}`}
                            type="button"
                            onClick={() =>
                              void handleSendMessage(rotulo, undefined, {
                                modo_adaptacao: op.modo_adaptacao,
                                template_id: op.template_id,
                                formato_saida: op.formato_saida || "docx",
                                gerar_arquivo_atividade: true,
                              })
                            }
                            className="cursor-pointer rounded-full bg-surface-accent px-4 py-1.5 text-xs font-medium text-ink transition-colors hover:bg-surface-accent-strong sm:text-sm"
                          >
                            {rotulo}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* painel de criacao/importacao do PEI, com a barra e os botoes dentro */}
              {mostrarPainel ? (
                <Conteudopei 
                  className="animate-[painel-entrar_700ms_cubic-bezier(0.16,1,0.3,1)]"
                  mostrarCriacao={mostrarCriacao}
                  aluno={aluno ?? null}
                  nomeAluno={aluno?.nome}
                  professor={teacherName ?? undefined}
                  onFechar={() => {
                    setMostrarPainel(false);
                    setMostrarCriacao(false);
                  }}
                  onCriarAgora={() => setMostrarCriacao(true)}
                  onConcluirPei={handleConcluirPei}
                  onVoltar={() => setMostrarCriacao(false)}
                  onEnviarChat={handleSendMessage}
                  chatPlaceholder={hasStarted ? "" : "Digite uma mensagem..."}
                  chatDisabled={isThinking}
                >
                  {botoesPei}
                </Conteudopei>
              ) : (
                <div className="animate-[chat-subir_700ms_cubic-bezier(0.16,1,0.3,1)] flex w-full flex-col gap-6">
                  {barra}
                  {botoesPei}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {alerta && <Toast alerta={alerta} limpar={limpar} />}
    </div>
  );
}
