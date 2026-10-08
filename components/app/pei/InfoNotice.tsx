"use client";

export default function InfoNotice() {
  return (
    <div className="mx-auto w-full max-w-[60rem] rounded-[70px] bg-surface-base px-6 py-6 sm:px-8 sm:py-7">
      <p className="text-base sm:text-lg">
        <span className="font-bold text-danger">Atenção:</span>{" "}
        <span className="text-primary">
          Não digite dados sensíveis (nome dos pais, nº celular, endereço...)
        </span>
      </p>
      <p className="mt-2 text-sm text-secondary">
        Informativa: Para responder pense nos seguintes critérios:
      </p>
      <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-primary marker:text-secondary">
        <li>os conteúdos e habilidades escolhidos;</li>
        <li>as adaptações necessárias;</li>
        <li>os recursos que serão usados;</li>
        <li>os apoios previstos.</li>
      </ul>
    </div>
  );
}