"use client";

import { useState } from "react";
import HeaderPag from "@/components/app/HeaderPagAl";
import BarraPesquisa from "@/components/common/Input";
import Aluno from "@/components/app/Aluno";
import BoxSemAluno from "@/components/app/BoxSemAluno";
import { FormAluno, FormDeletaAluno } from "@/components/app/forms/FormAlunoTurma"

export default function ConteudoAlunos(){
    const [temAluno] = useState(false);
    const [mostrarEditar, setMostrarEditar] = useState(false);
    const [mostrarExcluir, setMostrarExcluir] = useState(false);
    const [alunoSelecionado, setAlunoSelecionado] = useState<number | null>(null)

    const alunos = [
        {nome: "Junior Marcos", neuro: "TDAH", turma: "3º Ano A - Manhã"},
        {nome: "Julia Holanda", neuro: "TEA", turma: "3º Ano A - Manhã"},
        {nome: "Lucas Olioti", neuro: "TDAH", turma: "3º Ano A - Manhã"},
        {nome: "Rodrigo Mauro", neuro: "AH/SD", turma: "3º Ano A - Manhã"},
        {nome: "Sofia Gabriele", neuro: "Dislexia", turma: "3º Ano A - Manhã"},
    ]

    const turmas = [
        {value:"3ano-a-manha", label:"3º Ano A - Manhã"}
    ]

    function abrirEditar(index: number){
        setAlunoSelecionado(index);
        setMostrarEditar(true);
    }

    function fecharEditar(){
        setMostrarEditar(false);
        setAlunoSelecionado(null);
    }

    function abrirExcluir(index: number){
        setAlunoSelecionado(index);
        setMostrarExcluir(true);
    }

    function fecharExcluir(){
        setMostrarExcluir(false);
        setAlunoSelecionado(null);
    }

    return(
        <div className="flex flex-col w-full min-h-screen items-center">
            <div className="flex flex-col w-full gap-4 sm:gap-5 mt-8 sm:mt-12 lg:mt-20">
                <HeaderPag  />
                <BarraPesquisa type="search" placeholder="Procurar alunos..." />
            </div>
            {temAluno ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 mt-6 sm:mt-10 w-full">
                    {alunos.map((aluno, index) => (
                        <Aluno
                            key={aluno.nome}
                            nome={aluno.nome}
                            Neuro={aluno.neuro}
                            Turma={aluno.turma}
                            index={index}
                            onEditar={() => abrirEditar(index)}
                            onExcluir={() => abrirExcluir(index)}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex w-full flex-1 items-center justify-center">
                    <BoxSemAluno />
                </div>
            )}

            {mostrarEditar && alunoSelecionado !== null && (
                <FormAluno
                    turmas={turmas}
                    modo="editar"
                    nomeInicial={alunos[alunoSelecionado]?.nome}
                    onClose={fecharEditar}
                />
            )}

            {mostrarExcluir && alunoSelecionado !== null && (
                <FormDeletaAluno onClose={fecharExcluir} />
            )}
        </div>
    );
}