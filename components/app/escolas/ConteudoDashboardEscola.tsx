"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import HeaderDashEscola from "@/components/app/escolas/HeaderDashEscola";
import BoxSemTurmaEscola from "@/components/app/escolas/BoxSemTurmaEscola";
import CarregandoDashboard from "@/components/app/layout/CarregandoDashboard";
import { useData } from "@/components/app/state/DataProvider";
import { escolaPorId, turmasDaEscola } from "@/utils/data/types";
import { createTurma, updateTurma, deleteTurma, type Resultado } from "@/utils/data/controller";
import { ALERTAS } from "@/utils/alertas";
import Button from "@/components/common/Button";
import Toast, { useAlerta } from "@/components/common/Toast";
import Add from "@/public/add.svg";
import Turma, { type AlunoTag } from "@/components/app/turmas/Turma";
import { FormTurma, FormDeletaTurma } from "@/components/app/forms/FormAlunoTurma";

export default function ConteudoDashboardEscola() {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
  const [idEmExclusao, setIdEmExclusao] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const escolaId = searchParams.get("id");
  const { escolas, turmas, alunos, recarregar, hydrated } = useData();
  const { alerta, mostrar, limpar } = useAlerta();

  const escolasParaForm = useMemo(
    () => escolas.map((e) => ({ value: e.id, label: e.nome })),
    [escolas],
  );

  const escola = escolaId ? escolaPorId(escolas, escolaId) : undefined;
  const turmasDaEscolaList = useMemo(
    () => (escolaId ? turmasDaEscola(turmas, escolaId) : []),
    [turmas, escolaId],
  );
  const temTurmas = turmasDaEscolaList.length > 0;

  const alunosPorTurmaId = useMemo(() => {
    const mapa = new Map<string, AlunoTag[]>();
    for (const aluno of alunos) {
      const lista = mapa.get(aluno.turmaId) ?? [];
      lista.push({ id: aluno.id, nome: aluno.nome, neuros: aluno.neuro });
      mapa.set(aluno.turmaId, lista);
    }
    return mapa;
  }, [alunos]);

  const turmaEmEdicao = idEmEdicao
    ? turmasDaEscolaList.find((t) => t.id === idEmEdicao)
    : undefined;
  const turmaEmExclusao = idEmExclusao
    ? turmasDaEscolaList.find((t) => t.id === idEmExclusao)
    : undefined;

  async function tentar(resultado: Resultado): Promise<Resultado> {
    if (!resultado.ok) {
      mostrar(resultado.erro);
    }
    return resultado;
  }

  async function aoCriar(
    nome: string,
    _comp?: string[],
    novoEscolaId?: string,
  ): Promise<Resultado> {
    const resultado = await createTurma({
      nome,
      escolaId: novoEscolaId || undefined,
    });
    if (resultado.ok) {
      await recarregar();
    }
    return tentar(resultado);
  }

  async function aoEditar(
    nome: string,
    _comp?: string[],
    novoEscolaId?: string,
  ): Promise<Resultado> {
    if (!idEmEdicao) {
      return tentar({ ok: false, erro: ALERTAS.TURMA_NAO_ENCONTRADA });
    }
    const resultado = await updateTurma(idEmEdicao, {
      nome,
      escolaId: novoEscolaId || undefined,
    });
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

  if (!hydrated) {
    return <CarregandoDashboard />;
  }

  return (
    <div className="mx-auto flex w-full max-w-[1056px] flex-col gap-6 px-5 py-8 sm:px-8 lg:px-12 lg:py-[70px]">
      {/* header */}
      <div className="flex w-full flex-col">
        <HeaderDashEscola
          nomeEscola={escola?.nome}
          totalTurmas={turmasDaEscolaList.length}
        />
      </div>

      {/* lista de turmas */}
      <div className="flex flex-col gap-7 pb-6">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <p className="font-(family-name:--font-text-me-one) text-2xl sm:text-3xl">
            Turmas
          </p>
          <Button
            type="button"
            onClick={() => setMostrarForm(true)}
            className="flex w-auto flex-row items-center justify-center gap-2 px-3 py-1 sm:px-4 sm:py-1"
          >
            <img src={Add.src} className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" alt="" />
            <span className="whitespace-nowrap">Nova Turma</span>
          </Button>
        </div>

        {!temTurmas ? (
          <div className="flex w-full flex-1 items-center justify-center">
            <BoxSemTurmaEscola onCriarTurma={() => setMostrarForm(true)} />
          </div>
        ) : null}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 xl:gap-8 w-full">
          {turmasDaEscolaList.map((turma) => (
            <Turma
              key={turma.id}
              nomeTurma={turma.nome}
              alunos={alunosPorTurmaId.get(turma.id) ?? []}
              href={`/dashboardTurma?id=${turma.id}`}
              onEditar={() => setIdEmEdicao(turma.id)}
              onExcluir={() => setIdEmExclusao(turma.id)}
            />
          ))}
        </div>

        {/* forms de criar, editar e excluir turma */}
        {mostrarForm ? (
          <FormTurma
            escolas={escolasParaForm}
            escolaIdInicial={escolaId ?? ""}
            onClose={() => setMostrarForm(false)}
            onSalvar={aoCriar}
          />
        ) : null}

        {turmaEmEdicao ? (
          <FormTurma
            key={turmaEmEdicao.id}
          modo="editar"
            nomeInicial={turmaEmEdicao.nome}
            escolaIdInicial={turmaEmEdicao.escolaId ?? ""}
            escolas={escolasParaForm}
            onClose={() => setIdEmEdicao(null)}
            onSalvar={aoEditar}
          />
        ) : null}

        {turmaEmExclusao ? (
          <FormDeletaTurma
            nomeTurma={turmaEmExclusao.nome}
            onClose={() => setIdEmExclusao(null)}
            onExcluir={confirmarExclusao}
          />
        ) : null}
      </div>

      {alerta ? <Toast alerta={alerta} limpar={limpar} /> : null}
    </div>
  );
}
