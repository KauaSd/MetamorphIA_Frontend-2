"use client";

import Button from "@/components/common/Button";
import BoxVazio from "@/components/common/BoxVazio";
import GroupAdd from "@/public/group_add.svg";

interface BoxSemTurmaProps {
  onCriarTurma: () => void;
}

export default function BoxSemTurma({ onCriarTurma }: BoxSemTurmaProps) {
  return (
    <BoxVazio
      titulo="Nenhuma turma encontrada"
      descricao="Crie uma turma e adicione seus alunos para iniciar uma conversa com o contexto certo."
      acao={
        <Button
          type="button"
          onClick={onCriarTurma}
          className="w-full max-w-[180px] px-3 py-1 sm:px-4 sm:py-1 flex flex-row gap-2 justify-center items-center"
        >
          <img src={GroupAdd.src} className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" alt="" />
          Criar Turma
        </Button>
      }
    />
  );
}
