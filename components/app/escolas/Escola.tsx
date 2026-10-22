"use client";

import { useState, useRef, useEffect } from "react";
import TagAluno from "@/components/common/TagAluno";
import { EllipsisVertical } from "lucide-react";
import Encaracolado from "@/components/common/Encaracolado";
import EncaracoladoSvg from "@/public/EncaracoladoTurma.svg";
import VerMais from "@/components/common/VerMais";
import Link from "next/link";
import { corDoNome } from "@/utils/cores";

/** quantas turmas aparecem no card antes do "+N" */
const MAX_TAGS = 4;

export interface TurmaTag {
  id?: string | number;
  nome: string;
}

export type TurmaResumo = TurmaTag;

interface EscolaProps {
  nomeEscola: string;
  turmas: TurmaTag[];
  href?: string;
  onEditar?: () => void;
  onExcluir?: () => void;
}

export default function Escola(props: EscolaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function clicarFora(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function fecharComEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", clicarFora);
    document.addEventListener("keydown", fecharComEsc);

    return () => {
      document.removeEventListener("mousedown", clicarFora);
      document.removeEventListener("keydown", fecharComEsc);
    };
  }, [isOpen]);

  function handleEditar() {
    setIsOpen(false);
    props.onEditar?.();
  }

  function handleExcluir() {
    setIsOpen(false);
    props.onExcluir?.();
  }

  const visiveis = props.turmas.slice(0, MAX_TAGS);
  const restantes = props.turmas.length - visiveis.length;

  const conteudo = (
    <div className="flex flex-col gap-2 sm:gap-2.5">
      <div className="flex items-center justify-between pr-8">
        <p className="truncate text-xl sm:text-2xl font-(family-name:--font-text-me-one)">
          {props.nomeEscola}
        </p>
      </div>

      <div className="flex flex-col gap-0.5">
        <div className="grid grid-cols-[auto_auto] justify-start gap-x-2.5 gap-y-0.5">
          {visiveis.map((turma, index) => (
            <TagAluno
              key={turma.id || index}
              nome={turma.nome}
              neuros={[]}
              cor={corDoNome(turma.nome)}
            />
          ))}
        </div>

        {restantes > 0 ? (
          <p className="text-xs text-secondary pl-0.5 mt-0.5">
            +{restantes} turma{restantes > 1 ? "s" : ""}
          </p>
        ) : null}
      </div>
    </div>
  );

  const area = <div className="flex flex-col">{conteudo}</div>;

  const superficie = `
    relative flex w-full flex-col
    min-h-[130px] sm:min-h-[135px]
    bg-surface-base
    rounded-[50px]
    px-7 sm:px-8
    py-3.5
    transition-colors
  `;

  const enfeite = (
    <Encaracolado
      src={EncaracoladoSvg.src}
      className="pointer-events-none absolute left-[-10px] top-1/2 -translate-y-1/2 w-[32px] aspect-[36/118]"
    />
  );

  return (
    <div className={`relative w-full ${isOpen ? "z-40" : "z-0"}`}>
      {props.href ? (
        <Link
          href={props.href}
          aria-label={`Abrir escola ${props.nomeEscola}`}
          className={`
            ${superficie}
            cursor-pointer
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-accent
          `}
        >
          {enfeite}
          {area}
        </Link>
      ) : (
        <div className={superficie}>
          {enfeite}
          {area}
        </div>
      )}

      <div className={`absolute right-5 top-5 ${isOpen ? "z-50" : "z-20"}`} ref={menuRef}>
        <button
          type="button"
          aria-label={`Opcoes da escola ${props.nomeEscola}`}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          className="cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <EllipsisVertical height={"25px"} />
        </button>

        {isOpen ? (
          <div className="absolute right-0 top-full mt-2 z-50">
            <VerMais onEditar={handleEditar} onExcluir={handleExcluir} />
          </div>
        ) : null}
      </div>
    </div>
  );
}
