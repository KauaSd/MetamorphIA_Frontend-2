"use client";

import { useMemo, useState } from "react";
import HeaderPag from "@/components/app/HeaderPagTurmas";
import BarraPesquisa from "@/components/common/Input";
import Turma from "@/components/app/Turma";
import BoxSemTurma from "@/components/app/BoxSemTurma";
import Toast, { useAlerta } from "@/components/common/Toast";
import { FormTurma, FormDeletaTurma } from "@/components/app/forms/FormAlunoTurma";
import { useData } from "@/components/app/state/DataProvider";
import { createTurma, deleteTurma, updateTurma } from "@/utils/data/controller";
import type { Resultado } from "@/utils/data/controller";
import { ALERTAS } from "@/utils/alertas";
import { alunosDaTurma } from "@/utils/data/types";

export default function ConteudoTurmas() {
  const { turmas, alunos, recarregar } = useData();
  const [mostrarForm, setMostrarForm] = useState(false);
  const [busca, setBusca] = useState("");
  const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
  const [idEmExclusao, setIdEmExclusao] = useState<string | null>(null);
  const { alerta, mostrar, limpar } = useAlerta();

  const turmaEmEdicao = idEmEdicao
    ? turmas.find((turma) => turma.id === idEmEdicao)
    : undefined;
  const turmaEmExclusao = idEmExclusao
    ? turmas.find((turma) => turma.id === idEmExclusao)
    : undefined;

  /** o form fica aberto e o toast aparece quando o controller recusa */
  async function tentar(resultado: Resultado): Promise<Resultado> {
    if (!resultado.ok) {
      mostrar(resultado.erro);
    }
    return resultado;
  }

  async function aoCriar(nome: string): Promise<Resultado> {
    const resultado = await createTurma({ nome });
    if (resultado.ok) {
      await recarregar();
    }
    return tentar(resultado);
  }

  async function aoEditar(nome: string): Promise<Resultado> {
    if (!idEmEdicao) {
      return tentar({ ok: false, erro: ALERTAS.TURMA_NAO_ENCONTRADA });
    }
    const resultado = await updateTurma(idEmEdicao, { nome });
    if (resultado.ok) {
      await recarregar();
    }
    return tentar(resultado);
  }

  async function confirmarExclusao(): Promise<Resultado> {
    if (!idEmExclusao) {
      return tentar({ ok: false, erro: ALERTAS.TURMA_NAO_ENCONTRADA });
    }
    const resultado = await deleteTurma(idEmExclusao);
    if (resultado.ok) {
      await recarregar();
    }
    return tentar(resultado);
  }

  const turmasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return turmas;
    return turmas.filter((turma) => turma.nome.toLowerCase().includes(termo));
  }, [turmas, busca]);

  const temTurma = turmas.length > 0;
  const temResultado = turmasFiltradas.length > 0;

  return (
    <div className="flex flex-col w-full min-h-screen items-center">
      <div className="flex flex-col w-full gap-4 sm:gap-5 mt-8 sm:mt-12 lg:mt-20">
        <HeaderPag onCriarTurma={() => setMostrarForm(true)} />
        <BarraPesquisa
          type="search"
          placeholder="Procurar turmas..."
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
        />
      </div>

      {temResultado ? (
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 xl:gap-8 mt-6 sm:mt-10 w-full">
            {turmasFiltradas.map((turma) => {
              const daTurma = alunosDaTurma(alunos, turma.id);

              return (
                <Turma
                  key={turma.id}
                  nomeTurma={turma.nome}
                  alunos={daTurma.map((aluno) => ({
                    id: aluno.id,
                    nome: aluno.nome,
                    neuros: aluno.neuro,
                  }))}
                  href={`/dashboardTurma?id=${turma.id}`}
                  onEditar={() => setIdEmEdicao(turma.id)}
                  onExcluir={() => setIdEmExclusao(turma.id)}
                />
              );
            })}
          </div>
        </div>
      ) : temTurma ? (
        <div className="flex flex-1 w-full flex-col items-center justify-center gap-2 py-16">
          <p className="text-lg text-secondary">Nenhuma turma encontrada</p>
          <p className="text-sm text-ink-muted">Tente outro termo de busca.</p>
        </div>
      ) : (
        <div className="flex flex-1 w-full items-center justify-center">
          <BoxSemTurma onCriarTurma={() => setMostrarForm(true)} />
        </div>
      )}

      {mostrarForm && (
        <FormTurma onClose={() => setMostrarForm(false)} onSalvar={aoCriar} />
      )}

      {turmaEmEdicao && (
        <FormTurma
          modo="editar"
          nomeInicial={turmaEmEdicao.nome}
          onClose={() => setIdEmEdicao(null)}
          onSalvar={aoEditar}
        />
      )}

      {turmaEmExclusao && (
        <FormDeletaTurma
          nomeTurma={turmaEmExclusao.nome}
          onClose={() => setIdEmExclusao(null)}
          onExcluir={confirmarExclusao}
        />
      )}

      {alerta && <Toast alerta={alerta} limpar={limpar} />}
    </div>
  );
}
