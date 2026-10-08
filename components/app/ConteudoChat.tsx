"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import ChatTgAluno from "@/components/app/ChatTgAluno";
import Conteudopei from "@/components/app/Conteudopei";
import EditaPEI from "@/components/app/EditaPEI";
import GeraPEI from "@/components/app/GeraPEI";
import ChatInput from "@/components/app/pei/ChatInput";
import Toast, { useAlerta } from "@/components/common/Toast";

import { useData } from "@/components/app/state/DataProvider";
import { primeiraNeuro, resolverChat } from "@/utils/data/types";
import { addMessage, openChatWith } from "@/utils/data/controller";
import { ALERTAS } from "@/utils/alertas";

// o mesmo formato de Mensagem do store, mais um id local para a lista nao
// embaralhar enquanto o stream ainda corre
type Bolha = {
  id: string;
  texto: string;
  autor: "professor" | "aluno";
  streaming?: boolean;
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

  const { conversas, alunos, teacherName, hydrated, recarregar } = useData();
  const { alerta, mostrar, limpar } = useAlerta();

  // o que o stream esta escrevendo agora; o que ja foi salvo vem do store
  const [rascunho, setRascunho] = useState<Bolha[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [mostrarPainel, setMostrarPainel] = useState(false);
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
        router.replace(`/chat?conversaId=${resultado.conversaId}`);
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
  async function persistir(texto: string, autor: "professor" | "aluno") {
    if (!conversaId) return;
    const resultado = await addMessage(conversaId, texto, autor);
    if (!resultado.ok) {
      mostrar(resultado.erro);
    }
  }

  const handleSendMessage = async (texto: string) => {
    // sem conversa criada ainda nao ha onde persistir a mensagem
    if (!conversaId) return;

    const conteudo = texto.trim();
    if (!conteudo) return;
    if (isThinking) return;

    const idDaMinha = `enviada-${Date.now()}`;
    const idDoBot = `${idDaMinha}-bot`;

    setIsThinking(true);
    setRascunho((prev) => [
      ...prev,
      { id: idDaMinha, texto: conteudo, autor: "professor" },
      { id: idDoBot, texto: "", autor: "aluno", streaming: true },
    ]);

    const controller = new AbortController();
    abortRef.current = controller;

    let respostaCompleta = "";

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
      const response = await fetch(`${apiUrl}/mock/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem: conteudo }),
        signal: controller.signal,
      });
      if (!response.body) {
        throw new Error("A resposta não possui stream.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";

      // le o stream linha a linha e mostra cada pedaco da resposta
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const linhas = buffer.split("\n");
        buffer = linhas.pop() ?? "";

        // cada linha vem no formato "data: {...}", e [DONE] fecha o stream
        for (const linha of linhas) {
          if (!linha.startsWith("data: ")) continue;
          const payload = linha.slice(6).trim();
          if (payload === "[DONE]") continue;

          try {
            const data = JSON.parse(payload);
            respostaCompleta += data.resposta;

            setRascunho((prev) =>
              prev.map((bolha) =>
                bolha.id === idDoBot ? { ...bolha, texto: respostaCompleta } : bolha,
              ),
            );
          } catch {}
        }
      }

      // so grava depois que a resposta veio inteira, para nao duplicar se a
      // tela recarregar no meio da leitura
      await persistir(conteudo, "professor");
      if (respostaCompleta.trim()) {
        await persistir(respostaCompleta, "aluno");
      }
    } catch (error) {
      if (controller.signal.aborted) return;

      console.error("Erro ao receber resposta:", error);

      // a mensagem do professor foi enviada mesmo sem resposta: ela nao pode
      // sumir no proximo reload
      await persistir(conteudo, "professor");

      setRascunho((prev) =>
        prev.map((bolha) =>
          bolha.id === idDoBot
            ? { ...bolha, texto: "Não foi possível obter uma resposta da IA." }
            : bolha,
        ),
      );
      mostrar(ALERTAS.CHAT_IA_FALHOU);
    } finally {
      // as mensagens agora moram no store, entao o rascunho pode sumir
      await recarregar();
      setRascunho([]);
      setIsThinking(false);
    }
  };

  // chat sem aluno nao existe: a rota so renderiza com aluno resolvido
  if (!hydrated || semAluno) return null;

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
                        className={`max-w-[75%] break-words rounded-t-[70px] px-5 py-3 ${
                          bolha.autor === "professor"
                            ? "rounded-bl-[70px] bg-sunken"
                            : "rounded-br-[70px] bg-surface-base"
                        }`}
                      >
                        {bolha.streaming && !bolha.texto && <Dots />}
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{bolha.texto}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
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
