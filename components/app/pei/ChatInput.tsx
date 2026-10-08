"use client";

import { useRef, useState } from "react";
import { Paperclip } from "lucide-react";
import type { Anexo } from "@/utils/pei/types";
import { AVISO_DADOS_SENSIVEIS, detectarDadosSensiveis } from "@/utils/pei/dadosSensiveis";

export interface ChatInputProps {
  placeholder?: string;
  disabled?: boolean;
  multiline?: boolean;
  validarPrivacidade?: boolean;
  maxAnexoBytes?: number;
  enviarLabel?: string;
  anexos?: Anexo[];
  onAdicionarAnexos?: (files: File[]) => void;
  onRemoverAnexo?: (nome: string) => void;
  onSubmit?: (texto: string, anexos: Anexo[]) => void;
}

export default function ChatInput({
  placeholder = "Digite uma mensagem...",
  disabled = false,
  multiline = false,
  validarPrivacidade = false,
  maxAnexoBytes,
  enviarLabel = "Enviar mensagem",
  anexos,
  onAdicionarAnexos,
  onRemoverAnexo,
  onSubmit,
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [anexosInternos, setAnexosInternos] = useState<Anexo[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const controlado = anexos !== undefined;
  const listaAnexos: Anexo[] = anexos ?? anexosInternos;

  const avisoSensivel = validarPrivacidade && detectarDadosSensiveis(inputValue).length > 0;

  function escolherArquivos(files: FileList | null) {
    if (!files) return;
    const permitidos = maxAnexoBytes
      ? Array.from(files).filter((arquivo) => arquivo.size <= maxAnexoBytes)
      : Array.from(files);
    if (onAdicionarAnexos) {
      onAdicionarAnexos(permitidos);
    } else if (!controlado) {
      setAnexosInternos((prev) => [
        ...prev,
        ...permitidos.map((arquivo) => ({
          name: arquivo.name,
          type: arquivo.type,
          size: arquivo.size,
        })),
      ]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removerAnexo(nome: string) {
    if (onRemoverAnexo) {
      onRemoverAnexo(nome);
    } else if (!controlado) {
      setAnexosInternos((prev) => prev.filter((anexo) => anexo.name !== nome));
    }
  }

  function enviar() {
    const texto = inputValue.trim();
    if (!texto && listaAnexos.length === 0) return;
    onSubmit?.(texto, listaAnexos);
    setInputValue("");
  }

  return (
    <form
      onSubmit={(evento) => {
        evento.preventDefault();
        enviar();
      }}
      className="flex w-full flex-col gap-2"
    >
      {listaAnexos.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4">
          {listaAnexos.map((anexo) => (
            <div
              key={anexo.name}
              className="flex items-center gap-2 rounded-full bg-surface-inverse/10 px-3 py-1 text-xs sm:text-sm"
            >
              <span className="max-w-[150px] truncate">{anexo.name}</span>
              <button
                type="button"
                onClick={() => removerAnexo(anexo.name)}
                className="cursor-pointer text-red-500 hover:text-red-600"
                aria-label="Remover arquivo"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        className={`flex w-full items-center rounded-[70px] bg-surface-base px-4 sm:px-5 md:px-6 ${
          multiline ? "py-2" : "h-11"
        }`}
      >
        <div className="flex w-full items-center justify-between">
          <div className="flex shrink-0 items-center gap-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(evento) => escolherArquivos(evento.target.files)}
              accept="image/*,.pdf,.doc,.docx,.txt,.xlsx,.pptx"
              multiple
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex cursor-pointer items-center justify-center"
              aria-label="Anexar arquivo ou imagem"
            >
              <Paperclip size={22} color="var(--primary)" />
            </button>
          </div>

          <div className="h-full min-w-0 flex-1">
            {multiline ? (
              <textarea
                value={inputValue}
                onChange={(evento) => setInputValue(evento.target.value)}
                onKeyDown={(evento) => {
                  if (evento.key === "Enter" && !evento.shiftKey) {
                    evento.preventDefault();
                    enviar();
                  }
                }}
                disabled={disabled}
                placeholder={placeholder}
                rows={1}
                className="max-h-32 min-h-[2.75rem] w-full resize-none bg-transparent px-3 text-sm text-primary outline-none focus:outline-none focus:ring-0 sm:text-base"
              />
            ) : (
              <input
                type="text"
                value={inputValue}
                onChange={(evento) => setInputValue(evento.target.value)}
                onKeyDown={(evento) => {
                  if (evento.key === "Enter") {
                    evento.preventDefault();
                    enviar();
                  }
                }}
                disabled={disabled}
                placeholder={placeholder}
                className="h-full w-full bg-transparent px-3 text-sm text-primary caret-[var(--primary)] outline-none focus:outline-none focus:ring-0 sm:text-base"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={disabled || (!inputValue.trim() && listaAnexos.length === 0)}
            aria-label={enviarLabel}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-[70px] bg-surface-inverse disabled:opacity-50"
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

      {avisoSensivel && (
        <p className="px-4 text-xs text-danger sm:text-sm">{AVISO_DADOS_SENSIVEIS}</p>
      )}
    </form>
  );
}