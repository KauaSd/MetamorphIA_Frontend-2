"use client";

import { useState } from "react";
import HeaderPag from "@/components/HeaderPagTurmas";
import BarraPesquisa from "@/components/Input";
import Turma from "@/components/Turma";
import BoxSemTurma from "@/components/BoxSemTurma";
import FormTurma from "@/components/FormTurma";
import FormDeletaTurma from "@/components/FormDeletaTurma";
import Link from "next/link";

export default function ConteudoTurmas(){
    const [temTurma, setTemTurma] = useState(false);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [mostrarExcluir, setMostrarExcluir] = useState(false);
    const [turmaSelecionada, setTurmaSelecionada] = useState<number | null>(null);

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

    function abrirEditar(index: number){
        setTurmaSelecionada(index);
        setMostrarEditar(true);
    }

    function fecharEditar(){
        setMostrarEditar(false);
        setTurmaSelecionada(null);
    }

    function abrirExcluir(index: number){
        setTurmaSelecionada(index);
        setMostrarExcluir(true);
    }

    function fecharExcluir(){
        setMostrarExcluir(false);
        setTurmaSelecionada(null);
    }

    return(
        <div className="flex flex-col w-full h-full items-center gap">
            <div className="flex flex-col w-full gap-5 mt-20">
                <HeaderPag onCriarTurma={abrirForm} />
                <BarraPesquisa type="search" placeholder="Procurar turmas..." />
            </div>

            {temTurma ? (
                <Link href="/dashboardTurma">
                    <div className="grid grid-cols-2 gap-20 mt-10">
                        {turmas.map((turma, index) => (
                            <Turma
                                key={index}
                                nomeTurma={turma.nomeTurma}
                                alunos={turma.alunos}
                                onEditar={() => abrirEditar(index)}
                                onExcluir={() => abrirExcluir(index)}
                            />
                        ))}
                    </div>
                </Link>
            ) : (
                <div className="flex items-center mt-20">
                    <BoxSemTurma onCriarTurma={abrirForm} />
                </div>
            )}

            {mostrarForm && (
                <FormTurma onClose={fecharForm} onCriar={criarTurma} />
            )}

            {mostrarEditar && turmaSelecionada !== null && (
                <FormTurma
                    modo="editar"
                    nomeInicial={turmas[turmaSelecionada]?.nomeTurma}
                    onClose={fecharEditar}
                    onCriar={fecharEditar}
                />
            )}

            {mostrarExcluir && turmaSelecionada !== null && (
                <FormDeletaTurma onClose={fecharExcluir} />
            )}
        </div>
    );
}