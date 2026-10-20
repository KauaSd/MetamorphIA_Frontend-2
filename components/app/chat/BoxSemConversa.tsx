"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";
import BoxVazio from "@/components/common/BoxVazio";
import Add from "@/public/add.svg";

interface BoxSemConversaProps {
  alunoId: string;
}

export default function BoxSemConversa({ alunoId }: BoxSemConversaProps) {
  const router = useRouter();

  const handleNovaConversa = () => {
    router.push(`/chat?alunoId=${alunoId}`);
  };

  return (
    <BoxVazio
      titulo="Nenhuma conversa encontrada"
      descricao="Inicie o primeiro bate-papo com este aluno para registrar o histórico."
      acao={
        <Button
          type="button"
          onClick={handleNovaConversa}
          className="w-full max-w-[200px] px-3 py-1 sm:px-4 sm:py-1 flex flex-row gap-2 justify-center items-center"
        >
          <img src={Add.src} className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" alt="" />
          <span className="whitespace-nowrap">Nova Conversa</span>
        </Button>
      }
    />
  );
}
