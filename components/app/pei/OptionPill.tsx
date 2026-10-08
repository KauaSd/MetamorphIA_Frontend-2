"use client";

export interface OptionPillProps {
  letra: string;
  texto: string;
  selecionado: boolean;
  modo: "single" | "multiple";
  desabilitado?: boolean;
  onAlternar: () => void;
}

export default function OptionPill({
  letra,
  texto,
  selecionado,
  modo,
  desabilitado = false,
  onAlternar,
}: OptionPillProps) {
  return (
    <button
      type="button"
      role={modo === "single" ? "radio" : "checkbox"}
      aria-label={`${letra}. ${texto}`}
      aria-checked={selecionado}
      disabled={desabilitado}
      onClick={onAlternar}
      className={`flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-left text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:text-base ${
        selecionado
          ? "bg-surface-accent text-ink"
          : "bg-surface-muted text-primary hover:bg-sunken"
      } disabled:cursor-not-allowed disabled:opacity-60`}
    >
      <span>{letra}.</span>
      <span>{texto}</span>
    </button>
  );
}