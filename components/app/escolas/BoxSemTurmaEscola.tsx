"use client";

import Button from "@/components/common/Button";
import BoxVazio from "@/components/common/BoxVazio";
import GroupAdd from "@/public/group_add.svg";

interface BoxSemTurmaEscolaProps {
  onCriarTurma: () => void;
}

export default function BoxSemTurmaEscola({ onCriarTurma }: BoxSemTurmaEscolaProps) {
  return (
    <BoxVazio
      titulo="Nenhuma turma cadastrada"
      descricao="Comece adicionando a primeira turma a esta escola."
      acao={
        <Button
          type="button"
          onClick={onCriarTurma}
          className="w-full max-w-[200px] px-3 py-1 sm:px-4 sm:py-1 flex flex-row gap-2 justify-center items-center"
        >
          <img src={GroupAdd.src} className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" alt="" />
          <span className="whitespace-nowrap">Adicionar Turma</span>
        </Button>
      }
    />
  );
}
