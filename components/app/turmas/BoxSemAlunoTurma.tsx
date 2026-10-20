"use client";

import Button from "@/components/common/Button";
import BoxVazio from "@/components/common/BoxVazio";
import Add from "@/public/add.svg";

interface BoxSemAlunoTurmaProps {
  onCriarAluno: () => void;
}

export default function BoxSemAlunoTurma({ onCriarAluno }: BoxSemAlunoTurmaProps) {
  return (
    <BoxVazio
      titulo="Nenhum aluno cadastrado"
      descricao="Comece adicionando o primeiro aluno a esta turma."
      acao={
        <Button
          type="button"
          onClick={onCriarAluno}
          className="w-full max-w-[200px] px-3 py-1 sm:px-4 sm:py-1 flex flex-row gap-2 justify-center items-center"
        >
          <img src={Add.src} className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" alt="" />
          <span className="whitespace-nowrap">Adicionar Aluno</span>
        </Button>
      }
    />
  );
}
