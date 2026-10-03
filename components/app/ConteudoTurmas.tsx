"use client";

import { useState } from "react";
import HeaderPag from "@/components/app/HeaderPagTurmas";
import BarraPesquisa from "@/components/common/Input";
import Turma from "@/components/app/Turma";
import BoxSemTurma from "@/components/app/BoxSemTurma";
import { FormTurma, FormDeletaTurma } from "@/components/app/forms/FormAlunoTurma";
import { useData } from "@/components/app/state/DataProvider";
import { createTurma, deleteTurma, updateTurma } from "@/utils/data/controller";
import type { Resultado } from "@/utils/data/controller";
import { alunosDaTurma, primeiraNeuro } from "@/utils/data/types";

export default function ConteudoTurmas() {
  const { turmas, alunos, recarregar, hydrated } = useData();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
  const [idEmExclusao, setIdEmExclusao] = useState<string | null>(null);

  async function aoCriar(nome: string): Promise<Resultado> {
    const resultado = await createTurma({ nome });
    if (resultado.ok) {
      await recarregar();
      setMostrarForm(false);
    }
    return resultado;
  }

  async function aoEditar(nome: string): Promise<Resultado> {
    if (!idEmEdicao) {
      return { ok: false, erro: { tom: "danger", titulo: "Turma não encontrada" } };
    }
    const resultado = await updateTurma(idEmEdicao, { nome });
    if (resultado.ok) {
      await recarregar();
      setIdEmEdicao(null);
    }
    return resultado;
  }

  async function confirmarExclusao(): Promise<Resultado> {
    if (!idEmExclusao) {
      return { ok: false, erro: { tom: "danger", titulo: "Turma não encontrada" } };
    }
    const resultado = await deleteTurma(idEmExclusao);
    if (resultado.ok) {
      await recarregar();
      setIdEmExclusao(null);
    }
    return resultado;
  }

  const temTurma = turmas.length > 0;

  return (
    <div className="flex flex-col w-full min-h-screen items-center">
      <div className="flex flex-col w-full gap-4 sm:gap-5 mt-8 sm:mt-12 lg:mt-20">
        <HeaderPag onCriarTurma={() => setMostrarForm(true)} />
        <BarraPesquisa type="search" placeholder="Procurar turmas..." />
      </div>

      {temTurma ? (
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-10 lg:gap-16 mt-6 sm:mt-10 w-full">
            {turmas.map((turma) => {
              const daTurma = alunosDaTurma(alunos, turma.id);

              return (
                <div key={turma.id} className="w-full">
                  <Turma
                    nomeTurma={turma.nome}
                    alunos={daTurma.map((aluno) => ({
                      nome: aluno.nome,
                      neuro: primeiraNeuro(aluno),
                    }))}
                    href={`/dashboardTurma?id=${turma.id}`}
                    onEditar={() => setIdEmEdicao(turma.id)}
                    onExcluir={() => setIdEmExclusao(turma.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 w-full items-center justify-center">
          <BoxSemTurma onCriarTurma={() => setMostrarForm(true)} />
        </div>
      )}

      {mostrarForm && (
        <FormTurma onClose={() => setMostrarForm(false)} onSalvar={aoCriar} />
      )}

      {idEmEdicao !== null && (
        <FormTurma
          modo="editar"
          nomeInicial={turmas.find((turma) => turma.id === idEmEdicao)?.nome ?? ""}
          onClose={() => setIdEmEdicao(null)}
          onSalvar={aoEditar}
        />
      )}

      {idEmExclusao !== null && (
        <FormDeletaTurma
          onClose={() => setIdEmExclusao(null)}
          onExcluir={confirmarExclusao}
        />
      )}
    </div>
  );
}
