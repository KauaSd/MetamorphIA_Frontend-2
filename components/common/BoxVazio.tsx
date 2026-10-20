import type { ReactNode } from "react";
import PersonSearch from "@/public/person_search.svg";

interface BoxVazioProps {
  titulo: string;
  descricao: string;
  acao: ReactNode;
  comMargemHorizontal?: boolean;
}

export default function BoxVazio({
  titulo,
  descricao,
  acao,
  comMargemHorizontal = true,
}: BoxVazioProps) {
  return (
    <div
      className={`bg-surface-base w-full max-w-[410px] min-h-[280px] sm:min-h-[330px] rounded-[70px] flex flex-col justify-center items-center gap-6 sm:gap-[30px] p-6 sm:p-8${
        comMargemHorizontal ? " mx-4" : ""
      }`}
    >
      <div className="bg-surface-accent w-14 sm:w-20 md:w-[100px] aspect-square shrink-0 rounded-full flex items-center justify-center">
        <img
          src={PersonSearch.src}
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-[60px] md:h-[60px]"
          alt=""
        />
      </div>
      <div className="flex flex-col gap-3 sm:gap-[15px] justify-center items-center">
        <p className="text-primary text-base text-center">{titulo}</p>
        <p className="text-secondary text-sm w-full max-w-[330px] text-center">
          {descricao}
        </p>
      </div>
      {acao}
    </div>
  );
}
