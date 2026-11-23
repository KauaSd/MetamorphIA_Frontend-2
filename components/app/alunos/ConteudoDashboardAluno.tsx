"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useData } from "@/components/app/state/DataProvider";
import {
  alunoPorId,
  conversasDoAluno as filtrarConversasDoAluno,
  turmaPorId,
  type StudentInsights,
} from "@/utils/data/types";
import { updateAluno, deleteAluno, openChatWith, type Resultado } from "@/utils/data/controller";
import { repository } from "@/utils/data/dataRepository";
import { apiDbFetch, getAuthToken, parseNumeroId } from "@/utils/apiClient";
import { peiService } from "@/utils/pei/service";
import { ALERTAS } from "@/utils/alertas";
import Resumo from "@/components/app/alunos/Resumo";
import Toast, { useAlerta } from "@/components/common/Toast";
import Engajamento from "@/components/app/alunos/Engajamento";
import HistoricoTags from "@/components/app/chat/HistoricoTags";
import { FormAluno, FormDeletaAluno, type DadosAluno } from "@/components/app/forms/FormAlunoTurma";
import CarregandoDashboard from "@/components/app/layout/CarregandoDashboard";
import { BarraCarregando } from "@/components/common/Carregando";
import HeaderPag from "@/components/app/alunos/HeaderDashAl";
import BoxSemConversa from "@/components/app/chat/BoxSemConversa";
import Estatistica from "@/components/app/alunos/CardEstatisticaAluno";

export default function ConteudoDashboardAluno() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const alunoId = searchParams.get("id");
  const { alunos, turmas, conversas, recarregar, hydrated } = useData();
  const { alerta, mostrar, limpar } = useAlerta();

  const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
  const [idEmExclusao, setIdEmExclusao] = useState<string | null>(null);
  const [abrindoChat, setAbrindoChat] = useState(false);
  const [baixandoPei, setBaixandoPei] = useState(false);

  const aluno = alunoId ? alunoPorId(alunos, alunoId) : undefined;
  const turma = aluno ? turmaPorId(turmas, aluno.turmaId) : undefined;
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
  const [insights, setInsights] = useState<StudentInsights | null>(null);

  useEffect(() => {
    if (!alunoId) return;
    let cancelado = false;
    repository
      .getStudentInsights(alunoId)
      .then((dados) => {
        if (!cancelado) setInsights(dados);
      })
      .catch(() => {});
    return () => {
      cancelado = true;
    };
  }, [alunoId, conversas.length]);

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
    const resultado = await openChatWith(alunoId);
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
      mostrar({
        tom: "info",
        titulo: "Baixar PEI",
        descricao: `Iniciando o download do PEI de ${aluno.nome}.`,
      });
      const baixou = await peiService.baixarUltimoPeiAluno(aluno);
      if (!baixou) {
        const gerado = await peiService.gerarPeiDocumento({
          aluno,
          componente: "Língua Portuguesa",
          periodo: "1º Bimestre",
          questions: [],
          respostas: {},
        });
        if (gerado?.anexo) {
          await peiService.baixarUltimoPeiAluno(aluno);
        }
      }
    } finally {
      setBaixandoPei(false);
    }
  }

  if (!hydrated) {
    return <CarregandoDashboard />;
  }

  if (!aluno) {
    return (
      <div className="mx-auto flex w-full max-w-[1056px] flex-col gap-6 px-5 py-8 sm:px-8 lg:px-12 lg:py-[70px]">
        <p className="text-center text-secondary">Aluno não encontrado</p>
        {alerta ? <Toast alerta={alerta} limpar={limpar} /> : null}
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
          onCriarPei={handleCriarPei}
          onBaixarPei={() => void handleBaixarPei()}
          abrindoChat={abrindoChat}
          onEditar={() => setIdEmEdicao(aluno.id)}
          onExcluir={() => setIdEmExclusao(aluno.id)}
        />
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Estatistica tipo={1} valor={insights?.atividadesAdaptadas ?? 8} />
        <Estatistica tipo={2} valor={insights?.engajamento ?? 74} />
        <Estatistica tipo={3} valor={insights?.peiGerado ?? 1} />
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-lg text-secondary font-semibold">Resumo do perfil</p>
        <Resumo
          tipo={2}
          txt={resumo || insights?.resumo || resumoDoAluno}
          onSave={handleSalvarResumo}
        />
      </div>

      <Engajamento tipo={2} itens={insights?.engajamentoPorMateria ?? []} />

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
