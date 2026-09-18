"use client"

import Menu from "@/components/app/Menu";
import HeaderPag from "@/components/app/HeaderDashTurma";
import Estatistica from "@/components/app/CardEstatisticaTurma";
import Resumo from "@/components/app/Resumo";
import Button from "@/components/common/Button";
import Engajamento from "@/components/app/Engajamento";
import Add from "@/public/add.svg";
import Aluno from "@/components/app/Aluno";
import Link from "next/link";
import { useState } from "react";
import { FormAluno } from "@/components/app/forms/FormAlunoTurma";

export default function dashboardTurma(){
    const [mostrarForm, setMostrarForm] = useState(false);

    const alunos = [
        {nome: "Junior Marcos", neuro: "TDAH", turma: "3º Ano A - Manhã"},
        {nome: "Julia Holanda", neuro: "TEA", turma: "3º Ano A - Manhã"},
        {nome: "Lucas Olioti", neuro: "TDAH", turma: "3º Ano A - Manhã"},
        {nome: "Rodrigo Mauro", neuro: "AH/SD", turma: "3º Ano A - Manhã"},
        {nome: "Sofia Gabriele", neuro: "Dislexia", turma: "3º Ano A - Manhã"},
    ]

    const turmas = [
        {value: "3ano-a-manha", label: "3º Ano A - Manhã"}
    ]

    function abrirForm(){
        setMostrarForm(true);
    }

    function fecharForm(){
        setMostrarForm(false);
    }

    return(
        <div className="flex min-h-screen w-full">
            <Menu />
    
                <div className="mx-auto flex w-full max-w-[1056px] flex-col gap-6 px-5 py-8 sm:px-8 lg:px-12 lg:py-[70px]">
                    <div className="flex w-full flex-col">
                        <HeaderPag />
                    </div>
                    <div className="flex flex-col gap-4">
                        <p className="text-lg text-[#797979] font-semibold">Contextualização geral da turma</p>
                        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            <Estatistica tipo={1} valor={18} subtexto={3} />
                            <Estatistica tipo={2} valor={5} subtexto={28} />
                            <Estatistica tipo={3} valor={12} />
                        </div>
                    </div>
                    <Resumo tipo={1} txt="A turma apresenta perfil heterogêneo de aprendizagem. 5 alunos possuem laudos ou suspeitas de neurodivergência (TDAH, TEA,  Dislexia). A maioria responde bem a atividades visuais e instruções  segmentadas. Recomenda-se uso de recursos multissensoriais e tempos  flexíveis nas avaliações." />
                    <Engajamento tipo={1} />
                    <div className="flex flex-col gap-4 pb-8">
                        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                            <p className="font-(family-name:--font-text-me-one) text-2xl sm:text-3xl">Alunos</p>
                            <Button type="button" onClick={abrirForm} className="flex w-full flex-row justify-center gap-3 sm:w-[210px]">
                                <img src={Add.src}  />
                                <p className="text-[#433F3F] font-(family-name:--font-text-me-one) text-2xl">Novo Aluno</p>
                            </Button>
                        </div>
                        <Link href="/dashboardAluno">
                            <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
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
                        </Link>

                        {mostrarForm && (
                            <FormAluno
                                turmas={turmas}
                                onClose={fecharForm}
                            />
                        )}
                    </div>
                </div>
        </div>
    )
}
