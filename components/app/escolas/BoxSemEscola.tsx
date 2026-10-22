"use client";

import Button from "@/components/common/Button";
import BoxVazio from "@/components/common/BoxVazio";
import AdicionarEscolaIcon from "@/public/adicionarEscola.svg";

interface BoxSemEscolaProps {
  onCriarEscola: () => void;
}

export default function BoxSemEscola({ onCriarEscola }: BoxSemEscolaProps) {
  return (
    <BoxVazio
      titulo="Nenhuma escola encontrada"
      descricao="Crie uma escola para organizar turmas e centralizar o acompanhamento pedagógico."
      acao={
        <Button
          type="button"
          onClick={onCriarEscola}
          className="w-full max-w-[180px] px-3 py-1 sm:px-4 sm:py-1 flex flex-row gap-2 justify-center items-center"
        >
          <img src={AdicionarEscolaIcon.src} className="w-5 h-5 shrink-0 object-contain" alt="" />
          Criar Escola
        </Button>
      }
    />
  );
}
