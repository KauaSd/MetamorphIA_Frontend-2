"use client";

import Button from "@/components/common/Button";
import Add from "@/public/add.svg";
import PersonSearch from "@/public/person_search.svg";
import { useRouter } from "next/navigation";

interface BoxSemConversaProps {
  alunoId: string;
}

export default function BoxSemConversa({ alunoId }: BoxSemConversaProps) {
  const router = useRouter();

  const handleNovaConversa = () => {
    router.push(`/chat?alunoId=${alunoId}`);
  };

  return (
    <div className="bg-surface-base w-full max-w-[410px] min-h-[280px] sm:min-h-[330px] rounded-[70px] flex flex-col justify-center items-center gap-6 sm:gap-[30px] p-6 sm:p-8 mx-4">
      <div className="bg-surface-accent w-14 sm:w-20 md:w-[100px] aspect-square shrink-0 rounded-full flex items-center justify-center">
        <img src={PersonSearch.src} className="w-8 h-8 sm:w-10 sm:h-10 md:w-[60px] md:h-[60px]" alt="" />
      </div>
      <div className="flex flex-col gap-3 sm:gap-[15px] justify-center items-center">
        <p className="text-primary text-base text-center">Nenhuma conversa encontrada</p>
        <p className="text-secondary text-sm w-full max-w-[330px] text-center">
          Inicie o primeiro bate-papo com este aluno para registrar o histórico.
        </p>
      </div>
      <Button type="button" onClick={handleNovaConversa} className="w-full max-w-[200px] px-3 py-1 sm:px-4 sm:py-1 flex flex-row gap-2 justify-center items-center">
        <img src={Add.src} className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" alt="" />
        <span className="whitespace-nowrap">Nova Conversa</span>
      </Button>
    </div>
  );
}