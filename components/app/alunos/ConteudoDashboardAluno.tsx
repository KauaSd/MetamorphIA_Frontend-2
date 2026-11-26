"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useData } from "@/components/app/state/DataProvider";
import {
  alunoPorId,
  conversasDoAluno as filtrarConversasDoAluno,
  escolaPorId,
  turmaPorId,
} from "@/utils/data/types";
import { updateAluno, deleteAluno, openChatWith, type Resultado } from "@/utils/data/controller";
import { repository } from "@/utils/data/dataRepository";
import { apiDbFetch, getAuthToken, parseNumeroId } from "@/utils/apiClient";
import { peiService } from "@/utils/pei/service";
import { ALERTAS } from "@/utils/alertas";
import Resumo from "@/components/app/alunos/Resumo";
import Toast, { useAlerta } from "@/components/common/Toast";
import HistoricoTags from "@/components/app/chat/HistoricoTags";
import { FormAluno, FormDeletaAluno, type DadosAluno } from "@/components/app/forms/FormAlunoTurma";
import CarregandoDashboard from "@/components/app/layout/CarregandoDashboard";
import { BarraCarregando } from "@/components/common/Carregando";
import HeaderPag from "@/components/app/alunos/HeaderDashAl";
import BoxSemConversa from "@/components/app/chat/BoxSemConversa";
import PeisDisciplinaCard from "@/components/app/alunos/PeisDisciplinaCard";
import MetasBimestreCard from "@/components/app/alunos/MetasBimestreCard";
import IndicadoresDesenvolvimentoCard from "@/components/app/alunos/IndicadoresDesenvolvimentoCard";

export default function ConteudoDashboardAluno() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const alunoId = searchParams.get("id");
  const {
    alunos,
    turmas,
    escolas,
    conversas,
    ehAdmin,
    podeGerenciarAlunos,
    recarregar,
    hydrated,
    carregandoConversas,
  } = useData();
  const { alerta, mostrar, limpar } = useAlerta();

  useEffect(() => {
    if (hydrated && ehAdmin) {
      router.replace("/escolas");
    }
  }, [hydrated, ehAdmin, router]);

  const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
  const [idEmExclusao, setIdEmExclusao] = useState<string | null>(null);
  const [abrindoChat, setAbrindoChat] = useState(false);
  const [baixandoPei, setBaixandoPei] = useState(false);

  const aluno = alunoId ? alunoPorId(alunos, alunoId) : undefined;
  const turma = aluno ? turmaPorId(turmas, aluno.turmaId) : undefined;
  const escola = turma?.escolaId ? escolaPorId(escolas, turma.escolaId) : undefined;
  const conversasDoAluno = alunoId ? filtrarConversasDoAluno(conversas, alunoId) : [];

  const turmasParaForm = useMemo(
    () => turmas.map((t) => ({ value: t.id, label: t.nome })),
    [turmas],
  );
  const alunoEmEdicao = idEmEdicao ? alunos.find((a) => a.id === idEmEdicao) : undefined;
  const alunoEmExclusao = idEmExclusao ? alunos.find((a) => a.id === idEmExclusao) : undefined;

  // o Resumo e editavel; enquanto nao houver edicao vale o texto montado
  // a partir dos dados do aluno, depois passa a valer o que foi salvo
  const resumoDoAluno = aluno
    ? aluno.descricao ||
      `Nome: ${aluno.nome} | Idade: ${aluno.idade} anos | Neurodivergência: ${aluno.neuro.join(", ") || "Nenhuma informada"} | Turma: ${turma?.nome || "Sem turma"}`
    : "";
  const [resumo, setResumo] = useState("");
  const insightsQuery = useQuery({
    queryKey: ["student-insights", alunoId, conversas.length],
    queryFn: ({ signal }) => repository.getStudentInsights(alunoId!, signal),
    enabled: Boolean(alunoId),
  });
  const insights = insightsQuery.data ?? null;
  const carregandoInsights = insightsQuery.isPending;

  async function handleSalvarResumo(novoResumo: string) {
    setResumo(novoResumo);
    if (!aluno) return;
    const numId = parseNumeroId(aluno.id);
    if (numId !== null && getAuthToken()) {
      try {
        await apiDbFetch(`/Alunos/${numId}/descricao`, {
          method: "PATCH",
          body: JSON.stringify({ desc_aluno: novoResumo }),
        });
      } catch {}
    }
    await updateAluno(aluno.id, { descricao: novoResumo });
    await recarregar();
  }

  async function tentar(resultado: Resultado): Promise<Resultado> {
    if (!resultado.ok) {
      mostrar(resultado.erro);
    }
    return resultado;
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

  async function handleBatePapo() {
    if (!alunoId) return;
    setAbrindoChat(true);
    const resultado = await openChatWith(alunoId, { nova: true });
    if (!resultado.ok) {
      setAbrindoChat(false);
      mostrar(resultado.erro);
      return;
    }
    await recarregar();
    setAbrindoChat(false);
    if (resultado.conversaId) {
      router.push(`/chat?conversaId=${resultado.conversaId}`);
    }
  }

  async function handleCriarPei() {
    if (!alunoId) return;
    setAbrindoChat(true);
    const resultado = await openChatWith(alunoId);
    if (!resultado.ok) {
      setAbrindoChat(false);
      mostrar(resultado.erro);
      return;
    }
    await recarregar();
    setAbrindoChat(false);
    if (resultado.conversaId) {
      router.push(`/chat?conversaId=${resultado.conversaId}&gerarPei=true`);
    }
  }

  async function handleBaixarPei() {
    if (!aluno || baixandoPei) return;
    setBaixandoPei(true);
    try {
      const baixou = await peiService.baixarUltimoPeiAluno(aluno);
      if (baixou) {
        mostrar(ALERTAS.ALTERACAO_PEI);
        return;
      }
      const gerado = await peiService.gerarPeiDocumento({
        aluno,
        componente: "Língua Portuguesa",
        periodo: "1º Bimestre",
        questions: [],
        respostas: {},
      });
      if (gerado?.anexo) {
        const baixouGerado = await peiService.baixarUltimoPeiAluno(aluno);
        if (baixouGerado) {
          mostrar(ALERTAS.ALTERACAO_PEI);
        }
      }
    } finally {
      setBaixandoPei(false);
    }
  }

  if (!hydrated || ehAdmin) {
    return <CarregandoDashboard />;
  }

  if (!aluno) {
    return (
      <div className="mx-auto flex w-full max-w-[1056px] flex-col gap-6 px-5 py-8 sm:px-8 lg:max-w-none lg:px-12 lg:py-[70px] xl:px-[clamp(48px,13.5vw,259px)]">
        <p className="text-center text-secondary">Aluno não encontrado</p>
        {alerta ? <Toast alerta={alerta} limpar={limpar} /> : null}
      </div>
    );
  }

  const peiFeito = Boolean(
    insights &&
      (insights.peiGerado > 0 ||
        insights.peisPorDisciplina.concluidos > 0 ||
        insights.peisPorDisciplina.disciplinas.some((d) => d.status === "concluido")),
  );

  return (
    <div className="mx-auto flex w-full max-w-[1056px] flex-col gap-6 px-5 py-8 sm:px-8 lg:max-w-none lg:px-12 lg:py-[70px] xl:px-[clamp(48px,13.5vw,259px)]">
      <div className="flex w-full flex-col">
        <HeaderPag
          aluno={aluno}
          nomeTurma={turma?.nome ?? ""}
          nomeEscola={escola?.nome}
          turmaId={aluno.turmaId}
          onBatePapo={handleBatePapo}
          onCriarPei={handleCriarPei}
          onBaixarPei={() => void handleBaixarPei()}
          abrindoChat={abrindoChat}
          chatLiberado={peiFeito}
          onEditar={
            podeGerenciarAlunos && !(escola?.institucional && escola?.papel === "professor")
              ? () => setIdEmEdicao(aluno.id)
              : undefined
          }
          onExcluir={
            podeGerenciarAlunos && !(escola?.institucional && escola?.papel === "professor")
              ? () => setIdEmExclusao(aluno.id)
              : undefined
          }
        />
      </div>

      <Resumo
        tipo={2}
        txt={resumo || insights?.resumo || resumoDoAluno}
        onSave={handleSalvarResumo}
      />

      {carregandoInsights ? (
        <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-[minmax(0,383fr)_minmax(0,624fr)] lg:gap-8">
          <div className="flex flex-col gap-5 lg:h-[548px] lg:justify-between lg:gap-[14px]">
            <div className="h-[277px] w-full animate-pulse rounded-[50px] bg-surface-base/70" />
            <div className="h-[257px] w-full animate-pulse rounded-[50px] bg-surface-base/70" />
          </div>
          <div className="h-[548px] w-full animate-pulse rounded-[50px] bg-surface-base/70" />
        </div>
      ) : (
        <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-[minmax(0,383fr)_minmax(0,624fr)] lg:gap-8">
          <div className="flex flex-col gap-5 lg:h-[548px] lg:justify-between lg:gap-[14px]">
            <PeisDisciplinaCard
              dados={
                insights?.peisPorDisciplina ?? {
                  statusGeral: "EM ANDAMENTO",
                  concluidos: 0,
                  total: 0,
                  disciplinas: [],
                }
              }
            />
            <MetasBimestreCard metas={insights?.metasDoBimestre ?? []} />
          </div>

          <div className="min-w-0">
            <IndicadoresDesenvolvimentoCard
              indicadores={(insights?.indicadoresDesenvolvimento ?? []).map((ind) =>
                conversasDoAluno.length === 0 &&
                !peiFeito &&
                (insights?.atividadesAdaptadas ?? 0) === 0
                  ? { ...ind, nivel: 0 }
                  : ind,
              )}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-7 pb-6">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <p className="font-(family-name:--font-text-me-one) text-2xl sm:text-3xl">Histórico de Conversas</p>
          <p className="text-sm text-secondary">
            {carregandoConversas ? "Carregando..." : `${conversasDoAluno.length} conversas`}
          </p>
        </div>

        {carregandoConversas && conversasDoAluno.length === 0 ? (
          <div className="flex flex-col gap-3">
            <div className="h-14 w-full animate-pulse rounded-[70px] bg-surface-base/70" />
            <div className="h-14 w-full animate-pulse rounded-[70px] bg-surface-base/70" />
          </div>
        ) : conversasDoAluno.length === 0 ? (
          <div className="flex w-full flex-1 items-center justify-center">
            <BoxSemConversa alunoId={aluno.id} />
          </div>
        ) : (
          <div className="flex max-h-[340px] flex-col gap-3 overflow-y-auto pr-2">
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

        {alunoEmEdicao ? (
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
        ) : null}

        {alunoEmExclusao ? (
          <FormDeletaAluno
            nomeAluno={alunoEmExclusao.nome}
            onClose={() => setIdEmExclusao(null)}
            onExcluir={confirmarExclusao}
          />
        ) : null}
      </div>

      {baixandoPei ? (
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          aria-label="Preparando documento PEI"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-inverse/25 px-4 backdrop-blur-[1.5px]"
        >
          <BarraCarregando className="w-52" />
        </div>
      ) : null}

      {alerta ? <Toast alerta={alerta} limpar={limpar} /> : null}
    </div>
  );
}
