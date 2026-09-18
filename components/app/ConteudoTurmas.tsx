"use client";

import { useState } from "react";
import HeaderPag from "@/components/app/HeaderPagTurmas";
import BarraPesquisa from "@/components/common/Input";
import Turma from "@/components/app/Turma";
import BoxSemTurma from "@/components/app/BoxSemTurma";
import { FormTurma } from "@/components/app/forms/FormAlunoTurma";
import Link from "next/link";

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
    <div className="flex flex-col w-full min-h-screen items-center">
      <div className="flex flex-col w-full gap-4 sm:gap-5 mt-8 sm:mt-12 lg:mt-20">
        <HeaderPag onCriarTurma={abrirForm} />
        <BarraPesquisa type="search" placeholder="Procurar turmas..." />
      </div>

      {temTurma ? (
        <Link href="/dashboardTurma" className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-10 lg:gap-16 mt-6 sm:mt-10 w-full">
            {turmas.map((turma, index) => (
              <Turma
                key={index}
                nomeTurma={turma.nomeTurma}
                alunos={turma.alunos}
              />
            ))}
          </div>
        </Link>
      ) : (
        <div className="flex flex-1 w-full items-center justify-center">
          <BoxSemTurma onCriarTurma={abrirForm} />
        </div>
      )}

      {mostrarForm && (
        <FormTurma onClose={fecharForm} onCriar={criarTurma} />
      )}
    </div>
  );
}