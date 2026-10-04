"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useData } from "@/components/app/state/DataProvider";
import { alunoPorId, alunosDaTurma, turmaPorId } from "@/utils/data/types";
import { createAluno, updateAluno, deleteAluno, openChatWith } from "@/utils/data/controller";
import type { Resultado } from "@/utils/data/controller";
import { ALERTAS } from "@/utils/alertas";
import Resumo from "@/components/app/Resumo";
import Toast, { useAlerta } from "@/components/common/Toast";
import Engajamento from "@/components/app/Engajamento";
import HistoricoTags from "@/components/app/HistoricoTags";
import Button from "@/components/common/Button";
import Add from "@/public/add.svg";
import { FormAluno, FormDeletaAluno, type DadosAluno } from "@/components/app/forms/FormAlunoTurma";
import CarregandoDashboard from "@/components/app/CarregandoDashboard";
import HeaderPag from "@/components/app/HeaderDashAl";
import { useState } from "react";
import BoxSemConversa from "@/components/app/BoxSemConversa";
import Estatistica from "@/components/app/CardEstatisticaAluno";

export default function ConteudoDashboardAluno() {
  const searchParams = useSearchParams();
  const alunoId = searchParams.get("id");
  const { alunos, turmas, conversas, recarregar, hydrated } = useData();
  const { alerta, mostrar, limpar } = useAlerta();

  const [mostrarForm, setMostrarForm] = useState(false);
  const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
  const [idEmExclusao, setIdEmExclusao] = useState<string | null>(null);

  const aluno = alunoId ? alunoPorId(alunos, alunoId) : undefined;
  const turma = aluno ? turmaPorId(turmas, aluno.turmaId) : undefined;
  const conversasDoAluno = alunoId ? conversas.filter((c) => c.alunoId === alunoId) : [];

  const turmasParaForm = turmas.map((t) => ({ value: t.id, label: t.nome }));
  const alunoEmEdicao = idEmEdicao ? alunos.find((a) => a.id === idEmEdicao) : undefined;
  const alunoEmExclusao = idEmExclusao ? alunos.find((a) => a.id === idEmExclusao) : undefined;

  async function tentar(resultado: Resultado): Promise<Resultado> {
    if (!resultado.ok) {
      mostrar(resultado.erro);
    }
    return resultado;
  }

  async function aoCriar(dados: DadosAluno): Promise<Resultado> {
    const resultado = await createAluno(dados);
    if (resultado.ok) {
      await recarregar();
    }
    return tentar(resultado);
  }

  async function aoEditar(dados: DadosAluno): Promise<Resultado> {
    if (!idEmEdicao) {
      return tentar({ ok: false, erro: ALERTAS.ALUNO_NAO_ENCONTRADO });
    }
    const resultado = await updateAluno(idEmEdicao, dados);
    if (resultado.ok) {
      await recarregar();
    }
    return tentar(resultado);
  }

  async function confirmarExclusao(): Promise<Resultado> {
    if (!idEmExclusao) {
      return tentar({ ok: false, erro: ALERTAS.ALUNO_NAO_ENCONTRADO });
    }
    const resultado = await deleteAluno(idEmExclusao);
    if (resultado.ok) {
      await recarregar();
    }
    return tentar(resultado);
  }

  const [abrindoChat, setAbrindoChat] = useState(false);
  const [mostrarPei, setMostrarPei] = useState(false);

  const router = useRouter();

  async function handleBatePapo() {
    if (!alunoId) return;
    setAbrindoChat(true);
    const resultado = await openChatWith(alunoId);
    setAbrindoChat(false);
    if (!resultado.ok) {
      mostrar(resultado.erro);
      return;
    }
    if (resultado.conversaId) {
      router.push(`/chat?conversaId=${resultado.conversaId}`);
    }
  }

  function handleGerarPei() {
    mostrar({ tom: "warning", titulo: "PEI indisponível", descricao: "A geração de PEI ainda não foi implementada." });
  }

  if (!hydrated) {
    return <CarregandoDashboard />;
  }

  if (!aluno) {
    return (
      <div className="mx-auto flex w-full max-w-[1056px] flex-col gap-6 px-5 py-8 sm:px-8 lg:px-12 lg:py-[70px]">
        <p className="text-center text-secondary">Aluno não encontrado</p>
        {alerta && <Toast alerta={alerta} limpar={limpar} />}
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1056px] flex-col gap-6 px-5 py-8 sm:px-8 lg:px-12 lg:py-[70px]">
      <div className="flex w-full flex-col">
        <HeaderPag
          aluno={aluno}
          nomeTurma={turma?.nome ?? ""}
          turmaId={aluno.turmaId}
          onBatePapo={handleBatePapo}
          onGerarPei={handleGerarPei}
          abrindoChat={abrindoChat}
          onEditar={() => setIdEmEdicao(aluno.id)}
          onExcluir={() => setIdEmExclusao(aluno.id)}
        />
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Estatistica tipo={1} valor={8} />
        <Estatistica tipo={2} valor={74} />
        <Estatistica tipo={3} valor={12} />
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-lg text-secondary font-semibold">Resumo do perfil</p>
        <Resumo
          tipo={2}
          txt={`Nome: ${aluno.nome} | Idade: ${aluno.idade} anos | Neurodivergência: ${aluno.neuro.join(", ") || "Nenhuma informada"} | Turma: ${turma?.nome || "Sem turma"}`}
        />
      </div>

      <Engajamento tipo={2} itens={[]} />

      <div className="flex flex-col gap-7 pb-6">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <p className="font-(family-name:--font-text-me-one) text-2xl sm:text-3xl">Histórico de conversas</p>
          <p className="text-sm text-secondary">{conversasDoAluno.length} conversas</p>
        </div>

        {conversasDoAluno.length === 0 ? (
          <div className="flex w-full flex-1 items-center justify-center">
            <BoxSemConversa alunoId={aluno.id} />
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {conversasDoAluno.map((conversa) => (
              <HistoricoTags
                key={conversa.id}
                chat={conversa.titulo}
                data={conversa.data}
                href={`/chat?conversaId=${conversa.id}`}
              />
            ))}
          </div>
        )}

        {mostrarForm && (
          <FormAluno
            turmas={turmasParaForm}
            turmaIdInicial={aluno.turmaId}
            onClose={() => setMostrarForm(false)}
            onSalvar={aoCriar}
          />
        )}

        {alunoEmEdicao && (
          <FormAluno
            turmas={turmasParaForm}
            modo="editar"
            nomeInicial={alunoEmEdicao.nome}
            idadeInicial={alunoEmEdicao.idade}
            neuroInicial={alunoEmEdicao.neuro}
            turmaIdInicial={alunoEmEdicao.turmaId}
            onClose={() => setIdEmEdicao(null)}
            onSalvar={aoEditar}
          />
        )}

        {alunoEmExclusao && (
          <FormDeletaAluno
            nomeAluno={alunoEmExclusao.nome}
            onClose={() => setIdEmExclusao(null)}
            onExcluir={confirmarExclusao}
          />
        )}
      </div>

      {alerta && <Toast alerta={alerta} limpar={limpar} />}
    </div>
  );
}