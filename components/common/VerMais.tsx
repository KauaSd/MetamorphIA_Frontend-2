"use client";

import { useEffect, useState } from "react";
import Editar from "@/public/EditarIcon.svg";
import Deletar from "@/public/DeletaIcon.svg";
import Encaracolado from "@/components/common/Encaracolado";

interface VerMaisProps {
  onEditar: () => void;
  onExcluir: () => void;
}

export default function VerMais({ onEditar, onExcluir }: VerMaisProps) {
  // Começa "fechado" e abre logo após montar, para a transição rodar
  // (mesma animação do DropDown).
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisivel(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      role="menu"
      className={`
        w-fit min-w-28 h-auto
        rounded-2xl
        bg-sunken text-primary
        shadow-lg
        p-1
        origin-top
        transition-all duration-200 ease-out
        ${
          visivel
            ? "translate-y-0 scale-y-100 opacity-100"
            : "-translate-y-1 scale-y-95 opacity-0"
        }
      `}
    >
      <div className="flex flex-col gap-0.5">
        <button
          type="button"
          role="menuitem"
          onClick={onEditar}
          className="
            flex w-full items-center gap-2
            rounded-full
            px-3 py-1.5
            text-left text-base leading-none
            text-primary
            transition-colors duration-150
            cursor-pointer
            hover:bg-surface-base
          "
        >
          <Encaracolado src={Editar.src} className="h-[12px] w-[12px] shrink-0" />
          <span>Editar</span>
        </button>

        <button
          type="button"
          role="menuitem"
          onClick={onExcluir}
          className="
            flex w-full items-center gap-2
            rounded-full
            px-3 py-1.5
            text-left text-base leading-none
            text-primary
            transition-colors duration-150
            cursor-pointer
            hover:bg-surface-base
          "
        >
          <Encaracolado src={Deletar.src} className="h-[12px] w-[10px] shrink-0" />
          <span>Excluir</span>
        </button>
      </div>
    </div>
  );
}