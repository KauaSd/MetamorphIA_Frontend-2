"use client";

import { useEffect, useRef, useState } from "react";
import { EllipsisVertical } from "lucide-react";
import Seta from "@/public/seta.svg";
import Button from "@/components/common/Button";
import Add from "@/public/add.svg";
import FilePEIIcon from "@/public/filePEI.svg";
import Link from "next/link";
import TagNeuro from "@/components/common/TagNeuro";
import VerMais from "@/components/common/VerMais";
import MenuPei from "@/components/app/alunos/MenuPei";
import { pegainicial } from "@/utils/pegariniciais";
import { corDoNome } from "@/utils/cores";
import type { Aluno } from "@/utils/data/types";

interface HeaderDashAlProps {
  aluno: Aluno;
  nomeTurma: string;
  /** id da turma do proprio aluno, para o link de voltar */
  turmaId: string;
  onBatePapo: () => void;
  onCriarPei?: () => void;
  onBaixarPei?: () => void;
  /** retrocompatibilidade com onGerarPei */
  onGerarPei?: () => void;
  abrindoChat: boolean;
  onEditar?: () => void;
  onExcluir?: () => void;
}

export default function HeaderDashAl({
  aluno,
  nomeTurma,
  turmaId,
  onBatePapo,
  onCriarPei,
  onBaixarPei,
  onGerarPei,
  abrindoChat,
  onEditar,
  onExcluir,
}: HeaderDashAlProps) {
  const corAvatar = corDoNome(aluno.nome);

  const [isOpen, setIsOpen] = useState(false);
  const [isPeiOpen, setIsPeiOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuPeiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen && !isPeiOpen) return;

    function clicarFora(event: MouseEvent) {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsOpen(false);
      }
      if (menuPeiRef.current && !menuPeiRef.current.contains(target)) {
        setIsPeiOpen(false);
      }
    }

    function fecharComEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setIsPeiOpen(false);
      }
    }

    document.addEventListener("mousedown", clicarFora);
    document.addEventListener("keydown", fecharComEsc);

    return () => {
      document.removeEventListener("mousedown", clicarFora);
      document.removeEventListener("keydown", fecharComEsc);
    };
  }, [isOpen, isPeiOpen]);

  function handleEditar() {
    setIsOpen(false);
    onEditar?.();
  }

  function handleExcluir() {
    setIsOpen(false);
    onExcluir?.();
  }

  function handleCriarPei() {
    setIsPeiOpen(false);
    if (onCriarPei) {
      onCriarPei();
    } else {
      onGerarPei?.();
    }
  }

  function handleBaixarPei() {
    setIsPeiOpen(false);
    onBaixarPei?.();
  }

  return (
    <div className="flex w-full flex-col gap-4">
      {/* voltar para a turma de onde o aluno veio */}
      <Link href={`/dashboardTurma?id=${turmaId}`} className="w-fit">
        <div className="flex cursor-pointer flex-row gap-3">
          <img src={Seta.src} className="h-[24px] w-[24px]" alt="" />
          <p className="text-sm font-semibold text-secondary sm:text-base">{nomeTurma}</p>
        </div>
      </Link>

      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-row items-start gap-3">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[70%] text-2xl font-bold text-ink sm:h-20 sm:w-20 sm:text-3xl ${corAvatar}`}
          >
            {pegainicial(aluno.nome)}
          </div>

          <div className="flex min-w-0 flex-col gap-2">
            <p className="font-(family-name:--font-text-me-one) text-2xl sm:text-3xl">
              {aluno.nome}
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-secondary sm:gap-5">
              {aluno.idade !== null && (
                <>
                  <p>{aluno.idade} anos</p>
                  <div className="h-2 w-2 rounded-full bg-secondary" />
                </>
              )}
              <p className="truncate">{nomeTurma}</p>
            </div>

            {aluno.neuro.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {aluno.neuro.map((rotulo) => (
                  <TagNeuro key={rotulo} label={rotulo} />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full flex-row gap-2 sm:w-auto sm:gap-3 lg:gap-5">
          <Button
            type="button"
            onClick={onBatePapo}
            disabled={abrindoChat}
            className="flex w-auto flex-row items-center justify-center gap-1.5 px-3 py-1 sm:py-1 bg-surface-success text-ink hover:bg-surface-success-strong"
          >
            <img src={Add.src} className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" alt="" />
            <p className="whitespace-nowrap font-(family-name:--font-text-me-one) text-xs sm:text-xl">
              {abrindoChat ? "Abrindo..." : "Chat"}
            </p>
          </Button>

          {/* menu de acoes do PEI */}
          <div className="relative shrink-0" ref={menuPeiRef}>
            <Button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setIsPeiOpen((prev) => !prev);
              }}
              aria-haspopup="menu"
              aria-expanded={isPeiOpen}
              className="flex w-auto flex-row items-center justify-center gap-1.5 bg-surface-warning text-ink hover:bg-surface-warning-strong px-3 py-1 sm:py-1"
            >
              <img src={FilePEIIcon.src} className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" alt="" />
              <p className="whitespace-nowrap font-(family-name:--font-text-me-one) text-xs sm:text-xl">
                PEI
              </p>
            </Button>

            {isPeiOpen ? (
              <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 z-20">
                <MenuPei onCriar={handleCriarPei} onBaixar={handleBaixarPei} />
              </div>
            ) : null}
          </div>

          {/* menu de acoes do aluno - mesma linguagem do card Aluno */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              aria-label={`Opcoes de ${aluno.nome}`}
              aria-haspopup="menu"
              aria-expanded={isOpen}
              className="flex h-full w-auto cursor-pointer items-center justify-center rounded-[70px] px-1 text-secondary transition-colors hover:bg-surface-muted"
              onClick={() => {
                setIsPeiOpen(false);
                setIsOpen((prev) => !prev);
              }}
            >
              <EllipsisVertical height={"28px"} />
            </button>

            {isOpen ? (
              <div className="absolute right-0 top-full mt-2 z-20">
                <VerMais onEditar={handleEditar} onExcluir={handleExcluir} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
