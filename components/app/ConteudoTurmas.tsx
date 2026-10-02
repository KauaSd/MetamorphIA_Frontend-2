"use client";

import { use, useState } from "react";
import HeaderPag from "@/components/app/HeaderPagTurmas";
import BarraPesquisa from "@/components/common/Input";
import Turma from "@/components/app/Turma";
import BoxSemTurma from "@/components/app/BoxSemTurma";
import { FormTurma, FormDeletaTurma } from "@/components/app/forms/FormAlunoTurma";
import Link from "next/link";

// dados de exemplo das turmas
const turmasMock = [
  {
    nomeTurma: "3º Ano A - Manhã",
    alunos: [
      {nome: "Junior M.", neuro:"TDAH", turma:"3º Ano A - Manhã"},
      {nome: "Julia H.", neuro:"TEA", turma:"3º Ano A - Manhã"},
      {nome: "Lucas O.", neuro:"TDAH", turma:"3º Ano A - Manhã"},
      {nome: "Rodrigo M.", neuro:"AH/SD", turma:"3º Ano A - Manhã"},
    ]
  },
];

export default function ConteudoTurmas(){
  const [temTurma, setTemTurma] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [mostrarExcluir, setMostrarExcluir] = useState(false);
  const [turmaSelecionada, setTurmaSelecionada] = useState<number | null>(null)

  const [turmas, setTurmas] = useState(turmasMock);

  function abrirForm(){
    setMostrarForm(true);
  }

  function fecharForm(){
    setMostrarForm(false);
  }

  function criarTurma(){
    setTurmas(turmasMock);
    setTemTurma(true);
    setMostrarForm(false);
  }

  function abrirEditar(index:number){
    setTurmaSelecionada(index);
    setMostrarEditar(true);
  }

  function fecharEditar(){
    setMostrarEditar(false);
    setTurmaSelecionada(null);
  }

  function abrirExcluir(index:number){
    setTurmaSelecionada(index);
    setMostrarExcluir(true);
  }

  function fecharExcluir(){
    setMostrarExcluir(false);
    setTurmaSelecionada(null);
  }

  // remove a turma escolhida da lista
  function confirmarExclusao(){
    if (turmaSelecionada === null) return;

    const novasTurmas = turmas.filter((_, i) => i !== turmaSelecionada);
    setTurmas(novasTurmas);

    if (novasTurmas.length === 0){
      setTemTurma(false);
    }

    fecharExcluir();
  }

  return(
    <div className="flex flex-col w-full min-h-screen items-center">
      {/* header e barra de busca */}
      <div className="flex flex-col w-full gap-4 sm:gap-5 mt-8 sm:mt-12 lg:mt-20">
        <HeaderPag onCriarTurma={abrirForm} />
        <BarraPesquisa type="search" placeholder="Procurar turmas..." />
      </div>

      {/* lista de turmas ou estado vazio */}
      {temTurma ? (
        <Link href="/dashboardTurma" className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-10 lg:gap-16 mt-6 sm:mt-10 w-full">
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
        <div className="flex flex-1 w-full items-center justify-center">
          <BoxSemTurma onCriarTurma={abrirForm} />
        </div>
      )}

      {/* forms de criar, editar e excluir */}
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

      {mostrarExcluir && turmaSelecionada !== null &&(
        <FormDeletaTurma onClose={fecharExcluir} onExcluir={confirmarExclusao} />
      )}
    </div>
  );
}