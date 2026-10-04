"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import ChatTgAluno from "@/components/app/ChatTgAluno";
import EditaPEI from "@/components/app/EditaPEI";
import GeraPEI from "@/components/app/GeraPEI";
import Toast, { useAlerta } from "@/components/common/Toast";

import { useData } from "@/components/app/state/DataProvider";
import { alunoPorId, primeiraNeuro } from "@/utils/data/types";
import { addMessage } from "@/utils/data/controller";
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
  const conversaId = searchParams.get("conversaId");

  const { conversas, alunos, teacherName, recarregar } = useData();
  const { alerta, mostrar, limpar } = useAlerta();

  // o que o stream esta escrevendo agora; o que ja foi salvo vem do store
  const [rascunho, setRascunho] = useState<Bolha[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const conversa = conversaId
    ? conversas.find((item) => item.id === conversaId)
    : undefined;
  const aluno = conversa ? alunoPorId(alunos, conversa.alunoId) : undefined;

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

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const texto = inputValue.trim();
    if (!texto) return;
    if (isThinking) return;

    const idDaMinha = `enviada-${Date.now()}`;
    const idDoBot = `${idDaMinha}-bot`;

    setInputValue("");
    setIsThinking(true);
    setRascunho((prev) => [
      ...prev,
      { id: idDaMinha, texto, autor: "professor" },
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
        body: JSON.stringify({ mensagem: texto }),
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
      await persistir(texto, "professor");
      if (respostaCompleta.trim()) {
        await persistir(respostaCompleta, "aluno");
      }
    } catch (error) {
      if (controller.signal.aborted) return;

      console.error("Erro ao receber resposta:", error);

      // a mensagem do professor foi enviada mesmo sem resposta: ela nao pode
      // sumir no proximo reload
      await persistir(texto, "professor");

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

  return (
    // tela do chat
    <div className="relative flex h-screen w-full overflow-hidden p-4 sm:p-6 md:p-11">
      <div className="flex h-full flex-1">
        <div className="absolute left-1/2 top-4 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-11 sm:top-11">
          <ChatTgAluno
            nome={aluno?.nome ?? "Aluno"}
            neuro={aluno ? primeiraNeuro(aluno) : "—"}
          />
        </div>

        <div className="relative flex h-full flex-1 items-center justify-center px-2">
          <div
            className={`absolute left-1/2 top-[30%] -translate-x-1/2 -translate-y-1/2 text-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              hasStarted
                ? "pointer-events-none top-[20%] -translate-y-8 opacity-0"
                : "opacity-100"
            }`}
          >
            <p className="whitespace-nowrap text-center text-3xl sm:text-4xl md:text-5xl">
              Bom dia, Prof. {teacherName ?? ""}
            </p>
          </div>

          {/* campo de mensagem e lista de conversa */}
          <div
            className={`absolute left-0 w-full px-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-8 md:px-16 lg:px-24 ${
              hasStarted ? "bottom-0" : "top-[52%] -translate-y-1/2"
            }`}
          >
            <div className="mx-auto flex w-full max-w-[64rem] flex-col gap-8">
              {/* bolhas da conversa */}
              {hasStarted && (
                <div className="flex max-h-[55vh] w-full flex-col gap-4 overflow-y-auto">
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

              {/* campo de escrita da mensagem */}
              <form onSubmit={handleSendMessage}>
                <div className="flex items-center w-full h-11 rounded-[70px] bg-surface-base px-4 sm:px-5 md:px-6">
                  <div className="flex w-full justify-between items-center">
                    <div className="flex gap-3 items-center shrink-0">
                      <div className="cursor-pointer">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.999898 9.54997H9.5499V0.949973C9.5499 0.31664 9.86657 -2.64645e-05 10.4999 -2.64645e-05H10.8999C11.5332 0.0666413 11.8832 0.383308 11.9499 0.949973V9.54997H20.4999C21.1332 9.54997 21.4499 9.86664 21.4499 10.5V10.95C21.4499 11.2166 21.3499 11.45 21.1499 11.65C20.9832 11.85 20.7666 11.95 20.4999 11.95H11.9499V20.5C11.8832 21.1666 11.5499 21.5 10.9499 21.5H10.4499C9.8499 21.4333 9.5499 21.1 9.5499 20.5V11.95H0.999898C0.699898 11.95 0.449898 11.85 0.249898 11.65C0.0832313 11.45 -0.000102025 11.2166 -0.000102025 10.95V10.5C-0.000102025 9.86664 0.333231 9.54997 0.999898 9.54997Z"
                            fill="var(--primary)"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 h-full">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={hasStarted ? "" : "Digite uma mensagem..."}
                        className="w-full h-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 ml-4 caret-[var(--primary)] text-sm sm:text-base md:text-lg"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isThinking}
                      aria-label="Enviar mensagem"
                      className="w-10 h-10 rounded-[70px] bg-surface-inverse flex items-center justify-center cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clipPath="url(#clip0_924_1025)">
                          <path
                            d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM9 11H7V9H9V11ZM13 11H11V9H13V11ZM17 11H15V9H17V11Z"
                            fill="var(--inverse)"
                          />
                        </g>

                        <defs>
                          <clipPath id="clip0_924_1025">
                            <rect width="24" height="24" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </button>
                  </div>
                </div>
              </form>

              {/* botoes de editar e gerar pei */}
              <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row sm:justify-center md:justify-end">
                <EditaPEI ativado={true} />
                <GeraPEI ativado={true} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {alerta && <Toast alerta={alerta} limpar={limpar} />}
    </div>
  );
}