"use client";

import { useState} from "react";
import HeaderPag from "@/components/HeaderPagAl";
import BarraPesquisa from "@/components/Input";
import Aluno from "@/components/Aluno";
import BoxSemAluno from "@/components/BoxSemAluno";

export default function ConteudoAlunos(){
    const [temAluno, setTemAluno] = useState(false);

    const alunos = [
        {nome: "Junior Marcos", neuro: "TDAH", turma: "3º Ano A - Manhã"},
        {nome: "Julia Holanda", neuro: "TEA", turma: "3º Ano A - Manhã"},
        {nome: "Lucas Olioti", neuro: "TDAH", turma: "3º Ano A - Manhã"},
        {nome: "Rodrigo Mauro", neuro: "AH/SD", turma: "3º Ano A - Manhã"},
        {nome: "Sofia Gabriele", neuro: "Dislexia", turma: "3º Ano A - Manhã"},
    ]

    return(
            <div className="flex flex-col w-full h-full items-center">
                <div className="flex flex-col w-full gap-5 mt-20">
                    <HeaderPag  />
                    <BarraPesquisa type="search" placeholder="Procurar alunos..." />
                </div>
    
                {temAluno ? (
                    <div className="grid grid-cols-2 gap-5 mt-10">
                        {alunos.map((aluno, index) => (
                            <Aluno
                                key={aluno.nome}
                                nome={aluno.nome}
                                Neuro={aluno.neuro}
                                Turma={aluno.turma}
                                index={index}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center mt-20">
                        <BoxSemAluno />
                    </div>
                )}
            </div>
        );
}