"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export interface StepNavigatorProps {
  podeAvancar: boolean;
  salvando?: boolean;
  carregando?: boolean;
  onAnterior?: () => void;
  onProximo?: () => void;
  avancarLabel?: string;
}

const BLOQUEADO =
  "flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted text-xl text-secondary transition-colors hover:bg-surface-base-hover disabled:cursor-not-allowed disabled:opacity-40";

export default function StepNavigator({
  podeAvancar,
  salvando = false,
  carregando = false,
  onAnterior,
  onProximo,
  avancarLabel = "Próxima pergunta",
}: StepNavigatorProps) {
  const bloqueado = salvando || carregando;
  const podeAnterior = carregando ? false : Boolean(onAnterior);

  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={onAnterior}
        disabled={!podeAnterior}
        aria-label="Pergunta anterior"
        className={BLOQUEADO}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={onProximo}
        disabled={!podeAvancar || bloqueado}
        aria-label={avancarLabel}
        aria-disabled={!podeAvancar || bloqueado}
        className={BLOQUEADO}
      >
        {salvando ? (
          <span
            data-testid="spinner"
            className="h-4 w-4 animate-spin rounded-full border-2 border-surface-inverse/30 border-t-surface-inverse"
          />
        ) : (
          <ChevronRight size={20} />
        )}
      </button>
    </div>
  );
}