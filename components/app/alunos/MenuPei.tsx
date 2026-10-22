"use client";

import { useEffect, useState } from "react";
import Encaracolado from "@/components/common/Encaracolado";
import DescriptionIcon from "@/public/description.svg";
import DownloadIcon from "@/public/file_download.svg";

interface MenuPeiProps {
  onCriar: () => void;
  onBaixar: () => void;
}

const CLASSE_ITEM = `
  flex w-full items-center gap-2
  rounded-full
  px-3 py-1.5
  text-left text-base leading-none
  text-primary
  transition-colors duration-150
  cursor-pointer
  hover:bg-surface-base
`;

export default function MenuPei({ onCriar, onBaixar }: MenuPeiProps) {
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
          onClick={onCriar}
          className={CLASSE_ITEM}
        >
          <Encaracolado src={DescriptionIcon.src} className="h-[14px] w-[14px] shrink-0" />
          <span>Criar</span>
        </button>

        <button
          type="button"
          role="menuitem"
          onClick={onBaixar}
          className={CLASSE_ITEM}
        >
          <Encaracolado src={DownloadIcon.src} className="h-[14px] w-[14px] shrink-0" />
          <span>Baixar</span>
        </button>
      </div>
    </div>
  );
}
