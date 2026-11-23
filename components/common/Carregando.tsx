"use client";

import { twMerge } from "tailwind-merge";

interface BarraCarregandoProps {
  className?: string;
  barClassName?: string;
}

/**
 * Barra horizontal minimalista de carregamento indeterminado: uma pequena barra
 * cinza desliza continuamente de um lado para o outro dentro da trilha.
 */
export function BarraCarregando({ className, barClassName }: BarraCarregandoProps) {
  return (
    <div
      role="progressbar"
      aria-label="Carregando"
      className={twMerge(
        "relative h-1.5 w-44 overflow-hidden rounded-full bg-sunken",
        className,
      )}
    >
      <div
        className={twMerge(
          "h-full w-2/5 rounded-full bg-secondary animate-[loading-bar-slide_1.2s_linear_infinite]",
          barClassName,
        )}
      />
    </div>
  );
}

interface OverlayCarregandoProps {
  ativo: boolean;
  mensagem?: string;
  className?: string;
}

/**
 * Sobreposicao acinzentada minimalista aplicada sobre um card/box durante
 * requisicoes API, exibindo apenas a barra horizontal centralizada.
 */
export function OverlayCarregando({
  ativo,
  mensagem = "Carregando",
  className,
}: OverlayCarregandoProps) {
  if (!ativo) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={mensagem}
      className={twMerge(
        "absolute inset-0 z-30 flex items-center justify-center rounded-[inherit] bg-surface-inverse/25 backdrop-blur-[1.5px]",
        className,
      )}
    >
      <BarraCarregando />
    </div>
  );
}
