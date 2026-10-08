"use client";

import { useRef, useState } from "react";
import { MessageCircle, Paperclip } from "lucide-react";
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
  anexos = [],
  onAdicionarAnexos,
  onRemoverAnexo,
  onSubmit,
}: ChatInputProps) {
  const [inputValue, setInputValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avisoSensivel = validarPrivacidade && detectarDadosSensiveis(inputValue).length > 0;

  function escolherArquivos(files: FileList | null) {
    if (!files) return;
    const permitidos = maxAnexoBytes
      ? Array.from(files).filter((arquivo) => arquivo.size <= maxAnexoBytes)
      : Array.from(files);
    onAdicionarAnexos?.(permitidos);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function enviar() {
    const texto = inputValue.trim();
    if (!texto && anexos.length === 0) return;
    onSubmit?.(texto, anexos);
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
      {anexos.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4">
          {anexos.map((anexo) => (
            <div
              key={anexo.name}
              className="flex items-center gap-2 rounded-full bg-surface-inverse/10 px-3 py-1 text-xs sm:text-sm"
            >
              <span className="max-w-[150px] truncate">{anexo.name}</span>
              <button
                type="button"
                onClick={() => onRemoverAnexo?.(anexo.name)}
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
                disabled={disabled}
                placeholder={placeholder}
                className="h-full w-full bg-transparent px-3 text-sm text-primary caret-[var(--primary)] outline-none focus:outline-none focus:ring-0 sm:text-base"
              />
            )}
          </div>

          <button
            type="submit"
            disabled={disabled || (!inputValue.trim() && anexos.length === 0)}
            aria-label={enviarLabel}
            className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-[70px] bg-surface-inverse disabled:opacity-50"
          >
            <MessageCircle size={20} color="var(--inverse)" />
          </button>
        </div>
      </div>

      {avisoSensivel && (
        <p className="px-4 text-xs text-danger sm:text-sm">{AVISO_DADOS_SENSIVEIS}</p>
      )}
    </form>
  );
}