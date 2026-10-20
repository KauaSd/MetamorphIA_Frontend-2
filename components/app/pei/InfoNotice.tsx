"use client";

export default function InfoNotice() {
  return (
    <div className="mx-auto w-full max-w-[60rem] rounded-[70px] bg-surface-base px-5 py-4 sm:px-6 sm:py-5">
      <p className="text-sm sm:text-base">
        <span className="font-bold text-danger">Atenção:</span>{" "}
        <span className="text-primary">
          Não digite dados sensíveis (nome dos pais, nº celular, endereço...)
        </span>
      </p>
      <p className="mt-1 text-xs text-secondary sm:text-sm">
        Informativa: Para responder pense nos seguintes critérios:
      </p>
      <ul className="mt-2 list-inside list-disc space-y-0.5 text-xs text-primary marker:text-secondary sm:text-sm">
        <li>os conteúdos e habilidades escolhidos;</li>
        <li>as adaptações necessárias;</li>
        <li>os recursos que serão usados;</li>
        <li>os apoios previstos.</li>
      </ul>
    </div>
  );
}