"use client";

import { useEffect, useState } from "react";
import Encaracolado from "@/components/common/Encaracolado";
import DescriptionIcon from "@/public/description.svg";
import DownloadIcon from "@/public/file_download.svg";

interface MenuPeiProps {
  onCriar: () => void;
  onBaixar?: () => void;
  disciplinasConcluidas?: string[];
  onBaixarDisciplina?: (disciplina: string) => void;
  onBaixarTodos?: () => void;
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

export default function MenuPei({
  onCriar,
  onBaixar,
  disciplinasConcluidas = [],
  onBaixarDisciplina,
  onBaixarTodos,
}: MenuPeiProps) {
  const [visivel, setVisivel] = useState(false);
  const [submenuBaixarAberto, setSubmenuBaixarAberto] = useState(false);
  const [submenuVisivel, setSubmenuVisivel] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisivel(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!submenuBaixarAberto) {
      setSubmenuVisivel(false);
      return;
    }
    const frame = requestAnimationFrame(() => setSubmenuVisivel(true));
    return () => cancelAnimationFrame(frame);
  }, [submenuBaixarAberto]);

  return (
    <div className="flex items-start gap-2">
      {submenuBaixarAberto ? (
        <div
          role="menu"
          className={`
            w-fit min-w-36 h-auto
            rounded-2xl
            bg-sunken text-primary
            shadow-lg
            p-1
            origin-top
            transition-all duration-200 ease-out
            ${
              submenuVisivel
                ? "translate-y-0 scale-y-100 opacity-100"
                : "-translate-y-1 scale-y-95 opacity-0"
            }
          `}
        >
          <div className="flex flex-col gap-0.5">
            {disciplinasConcluidas.length === 0 ? (
              <span className="px-3 py-1.5 text-sm text-secondary whitespace-nowrap">
                Nenhum PEI criado
              </span>
            ) : (
              <>
                {disciplinasConcluidas.map((disc) => (
                  <button
                    key={disc}
                    type="button"
                    role="menuitem"
                    onClick={() => onBaixarDisciplina?.(disc)}
                    className={`${CLASSE_ITEM} text-sm whitespace-nowrap`}
                  >
                    <Encaracolado src={DownloadIcon.src} className="h-[14px] w-[14px] shrink-0" />
                    <span>{disc}</span>
                  </button>
                ))}
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => onBaixarTodos?.()}
                  className={`${CLASSE_ITEM} text-sm font-medium whitespace-nowrap`}
                >
                  <Encaracolado src={DownloadIcon.src} className="h-[14px] w-[14px] shrink-0" />
                  <span>Baixar tudo</span>
                </button>
              </>
            )}
          </div>
        </div>
      ) : null}

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
            onClick={() => {
              if (onBaixarDisciplina || onBaixarTodos) {
                setSubmenuBaixarAberto((prev) => !prev);
              } else {
                onBaixar?.();
              }
            }}
            className={`${CLASSE_ITEM} ${submenuBaixarAberto ? "bg-surface-base" : ""}`}
          >
            <Encaracolado src={DownloadIcon.src} className="h-[14px] w-[14px] shrink-0" />
            <span>Baixar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
