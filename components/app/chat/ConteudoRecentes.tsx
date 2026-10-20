"use client";

import { useMemo } from "react";
import HeaderPag from "@/components/app/chat/HeaderRecentes";
import Historico from "@/components/app/chat/ConversasRecentes";
import { useData } from "@/components/app/state/DataProvider";
import {
  conversasRecentes,
  primeiraNeuro,
} from "@/utils/data/types";

export default function ConteudoRecentes() {
  const { conversas, alunos, turmas, hydrated } = useData();

  // conversa orfa de aluno removido nao vira item: chat so existe com aluno
  const chats = useMemo(() => {
    const alunosPorId = new Map(alunos.map((a) => [a.id, a]));
    const turmasPorId = new Map(turmas.map((t) => [t.id, t]));

    return conversasRecentes(conversas).flatMap((conversa) => {
      const aluno = alunosPorId.get(conversa.alunoId);
      if (!aluno) return [];
      const turma = turmasPorId.get(aluno.turmaId);

      return [{
        conversaId: conversa.id,
        aluno: aluno.nome,
        neuro: primeiraNeuro(aluno),
        data: conversa.data,
        turma: turma?.nome ?? "—",
        chat: conversa.titulo,
      }];
    });
  }, [conversas, alunos, turmas]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col w-full gap-5 mt-8 sm:mt-12 lg:mt-20">
        <HeaderPag />
      </div>
      <div className="flex flex-col mt-6 sm:mt-10 gap-4 sm:gap-5 pb-8">
        {hydrated && chats.length === 0 ? (
          <p className="text-secondary text-sm text-center py-8">
            Nenhuma conversa ainda
          </p>
        ) : null}
        {chats.map((chat) => (
          <Historico
            key={chat.conversaId}
            href={`/chat?conversaId=${chat.conversaId}`}
            aluno={chat.aluno}
            neuro={chat.neuro}
            data={chat.data}
            turma={chat.turma}
            chat={chat.chat}
          />
        ))}
      </div>
    </div>
  );
}
