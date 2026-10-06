"use client";

import HeaderPag from "@/components/app/HeaderRecentes";
import Historico from "@/components/app/ConversasRecentes";
import { useData } from "@/components/app/state/DataProvider";
import {
    alunoPorId,
    conversasRecentes,
    primeiraNeuro,
    turmaDoAluno,
} from "@/utils/data/types";

export default function Recentes() {
    const { conversas, alunos, turmas, hydrated } = useData();

    // conversa orfa de aluno removido nao vira item: chat so existe com aluno
    const chats = conversasRecentes(conversas)
        .filter((conversa) => alunoPorId(alunos, conversa.alunoId))
        .map((conversa) => {
            const aluno = alunoPorId(alunos, conversa.alunoId);
            const turma = turmaDoAluno(turmas, alunos, conversa.alunoId);
            return {
                conversaId: conversa.id,
                aluno: aluno?.nome ?? "Aluno",
                neuro: aluno ? primeiraNeuro(aluno) : "—",
                data: conversa.data,
                turma: turma?.nome ?? "—",
                chat: conversa.titulo,
            };
        });

    return (
        <div className="flex justify-center w-full min-w-0">
            <div className="flex w-full max-w-[1056px] flex-col px-5 sm:px-8 lg:px-12">
                <div className="flex flex-col w-full gap-5 mt-8 sm:mt-12 lg:mt-20">
                    <HeaderPag />
                </div>
                <div className="flex flex-col mt-6 sm:mt-10 gap-4 sm:gap-5 pb-8">
                    {hydrated && chats.length === 0 && (
                        <p className="text-secondary text-sm text-center py-8">
                            Nenhuma conversa ainda
                        </p>
                    )}
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
        </div>
    );
}
