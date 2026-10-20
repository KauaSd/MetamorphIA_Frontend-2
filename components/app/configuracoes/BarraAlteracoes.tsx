"use client";

import { useState } from "react";

interface BarraAlteracoesProps {
  /** rascunho atual (so serve para decidir se Salvar fica desabilitado) */
  nome: string;
  /** saida tentada com pendencia: a barra fica vermelha ate resolver */
  bloqueada?: boolean;
  onSalvar: () => Promise<void>;
  onCancelar: () => void;
}

/**
 * Barra fixa no rodape (no estilo alert, com as cores do menu lateral) que
 * aparece so quando existe alteracao pendente. Com ela visivel o modal de
 * configuracoes nao fecha ate escolher Salvar ou Cancelar alteracoes.
 */
export default function BarraAlteracoes({
  nome,
  bloqueada = false,
  onSalvar,
  onCancelar,
}: BarraAlteracoesProps) {
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const vazio = !nome.trim();

  async function salvar() {
    setSalvando(true);
    setErro(null);
    try {
      await onSalvar();
    } catch {
      setErro("Não foi possível salvar");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div
      role="alert"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-110 flex justify-center px-3"
    >
      <div
        className={`pointer-events-auto flex flex-wrap items-center justify-center gap-4 rounded-[70px] px-6 py-3 shadow-lg transition-colors ${
          bloqueada ? "bg-surface-danger text-ink" : "bg-surface-inverse text-inverse"
        }`}
      >
        <p className="text-sm font-bold">Você tem alterações não salvas</p>

        {erro ? (
          // herda a cor do fundo: legivel na barra escura e na vermelha
          <p className="text-sm font-bold">{erro}</p>
        ) : vazio ? (
          <p className="text-sm opacity-70">Informe um nome</p>
        ) : null}

        <button
          type="button"
          onClick={onCancelar}
          disabled={salvando}
          className={`rounded-[70px] px-4 py-1 text-sm font-bold transition-colors disabled:opacity-60 ${
            bloqueada
              ? "bg-surface-inverse text-inverse hover:bg-surface-inverse-hover"
              : "bg-surface-danger text-ink hover:bg-surface-danger/80"
          }`}
        >
          Cancelar alterações
        </button>

        <button
          type="button"
          onClick={salvar}
          disabled={salvando || vazio}
          className="rounded-[70px] bg-surface-success px-6 py-1 text-sm font-bold text-ink transition-colors hover:bg-surface-success/80 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {salvando ? "Salvando…" : "Salvar"}
        </button>
      </div>
    </div>
  );
}
