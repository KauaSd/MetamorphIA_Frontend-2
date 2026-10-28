"use client";

import { componenteLabel } from "@/utils/pei/opcoes";

export interface InfoNoticeProps {
  componente?: string;
}

export default function InfoNotice({ componente = "" }: InfoNoticeProps) {
  const tituloComponente = componenteLabel(componente) || "Artes";

  return (
    <div className="mx-auto w-full max-w-[60rem] rounded-[70px] bg-surface-base px-5 py-4 sm:px-6 sm:py-5">
      <p className="text-sm sm:text-base">
        <span className="font-bold text-danger">Atenção:</span>{" "}
        <span className="text-primary">
          Não digite dados sensíveis (nome dos pais, nº celular, endereço...)
        </span>
      </p>
      <p className="my-2 font-bold text-primary">PEI - {tituloComponente}</p>
      <p className="mt-1 text-xs font-bold text-primary sm:text-sm">
        O ponto de partida é sempre o Currículo Paulista.
      </p>
      <p className="mt-1 text-xs text-primary sm:text-sm">
        O professor utiliza o mesmo currículo da turma, mas faz adaptações, se necessário. Ele
        identifica as habilidades essenciais daquele ano/série.
      </p>
      <p className="mt-1 text-xs text-primary sm:text-sm">
        As habilidades mais importantes (estruturantes) devem ser priorizadas.
      </p>
    </div>
  );
}
