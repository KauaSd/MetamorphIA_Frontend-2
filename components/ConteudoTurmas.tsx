"use client";

import { useState } from "react";
import HeaderPag from "@/components/HeaderPagTurmas";
import BarraPesquisa from "@/components/Input";
import Turma from "@/components/Turma";
import BoxSemTurma from "@/components/BoxSemTurma";
import FormTurma from "@/components/FormTurma";

export default function ConteudoTurmas(){
    const [temTurma, setTemTurma] = useState(false);
    const [mostrarForm, setMostrarForm] = useState(false);

    const turmas = [
        {
            nomeTurma: "3º Ano A - Manhã",
            alunos: [
                {nome: "Junior M.", neuro: "TDAH", turma: "3º Ano A - Manhã"},
                {nome: "Julia H.", neuro: "TEA", turma: "3º Ano A - Manhã"},
                {nome: "Lucas O.", neuro: "TDAH", turma: "3º Ano A - Manhã"},
                {nome: "Rodrigo M.", neuro: "AH/SD", turma: "3º Ano A - Manhã"},
            ]
        },
    ]

    function abrirForm(){
        setMostrarForm(true);
    }

    function fecharForm(){
        setMostrarForm(false);
    }

    function criarTurma(){
        setTemTurma(true);
        setMostrarForm(false);
    }

    return(
        <div className="flex flex-col w-full h-full items-center gap">
            <div className="flex flex-col w-full gap-5 mt-20">
                <HeaderPag onCriarTurma={abrirForm} />
                <BarraPesquisa type="search" placeholder="Procurar turmas..." />
            </div>

            {temTurma ? (
                <div className="grid grid-cols-2 gap-20 mt-20">
                    {turmas.map((turma, index) => (
                        <Turma
                            key={index}
                            nomeTurma={turma.nomeTurma}
                            alunos={turma.alunos}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex items-center mt-20">
                    <BoxSemTurma onCriarTurma={abrirForm} />
                </div>
            )}

            {mostrarForm && (
                <FormTurma onClose={fecharForm} onCriar={criarTurma} />
            )}
        </div>
    );
}