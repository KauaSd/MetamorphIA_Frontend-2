"use client";

import { useState } from "react";

import ChatTgAluno from "@/components/app/ChatTgAluno";
import EditaPEI from "@/components/app/EditaPEI";
import GeraPEI from "@/components/app/GeraPEI";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
const nome = "Roberto";
type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
};
export default function ChatInicial() {
  const [hasStarted, setHasStarted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  


  const handleSendMessage = async (e: React.SubmitEvent<HTMLFormElement>) => {
  e.preventDefault();

  const text = inputValue.trim();

  if (!text) return;

  if (!hasStarted) {
    setHasStarted(true);
  }

  const userMessageId = Date.now();
  const botMessageId = userMessageId + 1;

  setMessages((prev) => [
    ...prev,
    {
      id: userMessageId,
      text,
      sender: "user",
    },
    {
      id: botMessageId,
      text: "",
      sender: "bot",
    },
  ]);

  setInputValue("");

  try {
    const response = await fetch("http://localhost:8000/mock/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mensagem: text,
      }),
    });

    if (!response.body) {
      throw new Error("A resposta não possui stream.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";
    let respostaCompleta = "";

    while (true) {
      const { value, done } = await reader.read();

      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const linhas = buffer.split("\n");

      buffer = linhas.pop() ?? "";

      for (const linha of linhas) {
        if (!linha.startsWith("data: ")) continue;

        const payload = linha.slice(6).trim();

        if (payload === "[DONE]") {
          continue;
        }

        try {
          const data = JSON.parse(payload);

          respostaCompleta += data.resposta;

          setMessages((prev) =>
            prev.map((message) =>
              message.id === botMessageId
                ? {
                    ...message,
                    text: respostaCompleta,
                  }
                : message
            )
          );
        } catch {
        }
      }
    }
  } catch (error) {
    console.error("Erro ao receber resposta:", error);

    setMessages((prev) =>
      prev.map((message) =>
        message.id === botMessageId
          ? {
              ...message,
              text: "Não foi possível obter uma resposta da IA.",
            }
          : message
      )
    );
  }
};

  return (
    <div className="relative flex h-screen w-full overflow-hidden p-4 sm:p-6 md:p-11">
      <div className="flex flex-1 h-full">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-11 sm:top-11">
          <ChatTgAluno />
        </div>

        <div className="relative flex flex-1 h-full items-center justify-center px-2">
          <div
            className={`
              absolute left-1/2 -translate-x-1/2
              text-center
              transition-all duration-500
              ease-[cubic-bezier(0.16,1,0.3,1)]
              ${
                hasStarted
                  ? "top-[20%] -translate-y-8 opacity-0 pointer-events-none"
                  : "top-[30%] opacity-100"
              }
            `}
          >
            <p className="text-3xl sm:text-4xl md:text-5xl text-center whitespace-nowrap">
              Bom dia, Prof. {nome}
            </p>
          </div>

          <div
            className={`
              absolute left-0 w-full
              px-4 sm:px-8 md:px-16 lg:px-24
              transition-all duration-700
              ease-[cubic-bezier(0.16,1,0.3,1)]
              ${
                hasStarted
                  ? "bottom-0"
                  : "top-[52%] -translate-y-1/2"
              }
            `}
          >
            <div className="w-full max-w-[64rem] mx-auto flex flex-col gap-8">

              {hasStarted && messages.length > 0 && (
                <div className="w-full flex flex-col gap-4 max-h-[55vh] overflow-y-auto">

                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex w-full ${
                        message.sender === "user"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`
                          max-w-[75%]
                          px-5 py-3
                          break-words
                          rounded-t-[70px]
                          ${
                            message.sender === "user"
                              ? "bg-[#D9D9D9] rounded-bl-[70px]"
                              : "bg-[#FFFDFA] rounded-br-[70px]"
                          }
                        `}
                      >
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ))}

                </div>
              )}

              <form onSubmit={handleSendMessage}>
                <div className="flex items-center w-full h-11 rounded-[70px] bg-[#FFFDFA] px-4 sm:px-5 md:px-6">

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
                            fill="#433F3F"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0 h-full">
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={
                          hasStarted
                            ? ""
                            : "Digite uma mensagem..."
                        }
                        className="w-full h-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 ml-4 caret-[#433F3F] text-sm sm:text-base md:text-lg"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-10 h-10 rounded-[70px] bg-[#433F3F] flex items-center justify-center cursor-pointer shrink-0"
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
                            fill="#FFFDFA"
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

              <div className="flex flex-col sm:flex-row justify-center md:justify-end gap-3 sm:gap-7 w-full sm:w-auto">
                <EditaPEI ativado={true} />
                <GeraPEI ativado={true} />
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}