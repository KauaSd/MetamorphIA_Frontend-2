"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import AdcAlunosIcon from "@/public/adcalunos.svg";
import AdcProfIcon from "@/public/adcprof.svg";
import GroupAdd from "@/public/group_add.svg";
import Encaracolado from "@/components/common/Encaracolado";
import EncaracoladoDesenvolvimentoSvg from "@/public/encaracolado_desenvolvimento.svg";
import Button from "@/components/common/Button";
import { type DropDownOption } from "@/components/common/DropDown";
import Toast, { useAlerta } from "@/components/common/Toast";
import FormProfessor from "@/components/app/forms/FormProfessor";
import {
  FormAluno,
  FormTurma,
  type DadosAluno,
  type DadosTurmaExtras,
} from "@/components/app/forms/FormAlunoTurma";
import {
  createAluno,
  createTurma,
  type Resultado,
} from "@/utils/data/controller";
import {
  buscarResumoPeisEscola,
  enviarConviteProfessorEscola,
  listarConvitesEscola,
  listarProfessoresEscola,
  vincularProfessorTurma,
} from "@/utils/data/apiRepository";
import type { Aluno, Escola, Turma } from "@/utils/data/types";

export interface ProfessorEscolaSlot {
  id: string;
  nome: string;
  turma: string;
  concluidos: number;
  total: number;
}

const TOTAL_SLOTS = 9;

interface DashboardEscolaAdmProps {
  escolaId: string;
  escola?: Escola;
  escolas: Escola[];
  turmasDaEscolaList: Turma[];
  alunosDaEscola: Aluno[];
  ehAdminRede?: boolean;
  onRecarregar: () => Promise<void>;
}

export default function DashboardEscolaAdm({
  escolaId,
  escola,
  escolas,
  turmasDaEscolaList,
  ehAdminRede = false,
  onRecarregar,
}: DashboardEscolaAdmProps) {
  const queryClient = useQueryClient();
  const { alerta, mostrar, limpar } = useAlerta();
  const [modalAberto, setModalAberto] = useState<
    "aluno" | "turma" | "professor" | null
  >(null);

  const resumoQuery = useQuery({
    queryKey: ["escola-peis-resumo", escolaId],
    queryFn: ({ signal }) => buscarResumoPeisEscola(escolaId, signal),
    enabled: Boolean(escolaId),
  });

  const professoresQuery = useQuery({
    queryKey: ["escola-professores", escolaId],
    queryFn: ({ signal }) => listarProfessoresEscola(escolaId, signal),
    enabled: Boolean(escolaId),
  });

  const convitesQuery = useQuery({
    queryKey: ["escola-convites", escolaId],
    queryFn: ({ signal }) => listarConvitesEscola(escolaId, signal),
    enabled: Boolean(escolaId),
  });

  const professores = useMemo<ProfessorEscolaSlot[]>(() => {
    const listaApi =
      resumoQuery.data?.professores && resumoQuery.data.professores.length > 0
        ? resumoQuery.data.professores
        : (professoresQuery.data ?? []);

    const daApi: ProfessorEscolaSlot[] = listaApi.map((p) => ({
      id: String(p.id_usuario),
      nome: p.nome_usuario || p.email_usuario || "Professor",
      turma:
        p.turma ||
        (p.tags_areas && p.tags_areas.length > 0
          ? p.tags_areas.join(", ")
          : p.papel === "adm"
            ? "Administrador"
            : "Professor"),
      concluidos: p.peis_concluidos ?? p.concluidos ?? 0,
      total: p.peis_total ?? p.total ?? 0,
    }));

    const emailsJaAtivos = new Set(
      listaApi
        .map((p) => (p.email_usuario ?? "").trim().toLowerCase())
        .filter(Boolean),
    );
    const pendentes: ProfessorEscolaSlot[] = (convitesQuery.data ?? [])
      .filter(
        (c) =>
          (c.status ?? "").toLowerCase() === "pendente" &&
          !emailsJaAtivos.has((c.email_convidado ?? "").trim().toLowerCase()),
      )
      .map((c) => ({
        id: `convite-${c.id_convite}`,
        nome: c.email_convidado,
        turma: "Convite pendente",
        concluidos: 0,
        total: 0,
      }));

    return [...daApi, ...pendentes];
  }, [resumoQuery.data?.professores, professoresQuery.data, convitesQuery.data]);

  const escolasParaForm = useMemo<DropDownOption[]>(
    () => escolas.map((e) => ({ value: e.id, label: e.nome })),
    [escolas],
  );
  const turmasParaForm = useMemo(
    () =>
      turmasDaEscolaList.map((t) => ({
        value: t.id,
        label: t.nome,
        disciplinas: t.disciplinas,
      })),
    [turmasDaEscolaList],
  );

  const totalConcluidos =
    resumoQuery.data?.concluidos ??
    professores.reduce((acc, p) => acc + p.concluidos, 0);
  const totalPeis =
    resumoQuery.data?.total ??
    professores.reduce((acc, p) => acc + p.total, 0);
  const percentual =
    resumoQuery.data?.percentual ??
    (totalPeis > 0 ? Math.round((totalConcluidos / totalPeis) * 100) : 0);
  const ultimoEnvio = resumoQuery.data?.ultimo_envio || "--/--/--";
  const proximoPeriodo = resumoQuery.data?.proximo_periodo || "--/-- até --/--";
  const totalSlots = Math.max(TOTAL_SLOTS, professores.length);

  async function tentar(resultado: Resultado): Promise<Resultado> {
    if (!resultado.ok) {
      mostrar(resultado.erro);
    }
    return resultado;
  }

  async function aoCriarAluno(dados: DadosAluno): Promise<Resultado> {
    const resultado = await createAluno(dados);
    if (resultado.ok) await onRecarregar();
    return tentar(resultado);
  }

  async function aoCriarTurma(
    nome: string,
    comp?: string[],
    novoEscolaId?: string,
    extras?: DadosTurmaExtras,
  ): Promise<Resultado> {
    const resultado = await createTurma({
      nome,
      escolaId: novoEscolaId || escolaId || undefined,
      disciplinas: comp,
      ...extras,
    });
    if (resultado.ok) await onRecarregar();
    return tentar(resultado);
  }

  async function salvarProfessor(dados: {
    email: string;
    disciplinas: string[];
    vinculos: Array<{ turmaId: string; disciplinas: string[] }>;
  }): Promise<boolean> {
    const limpo = dados.email.trim();
    if (!limpo) return false;

    if (escolaId) {
      try {
        const res = await enviarConviteProfessorEscola(escolaId, {
          email: limpo,
          tags_areas: dados.disciplinas,
        });
        await Promise.allSettled(
          dados.vinculos.map((v) =>
            vincularProfessorTurma(v.turmaId, {
              email: limpo,
              disciplinas: v.disciplinas,
            }),
          ),
        );
        mostrar({
          tom: "info",
          titulo: "Convite enviado",
          descricao: res.email_enviado
            ? `Link de convite enviado para ${limpo}.`
            : `Convite criado para ${limpo}${res.codigo_convite ? ` (código: ${res.codigo_convite})` : ""}.`,
        });
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["escola-professores", escolaId] }),
          queryClient.invalidateQueries({ queryKey: ["escola-convites", escolaId] }),
          queryClient.invalidateQueries({ queryKey: ["escola-peis-resumo", escolaId] }),
        ]);
      } catch (err) {
        mostrar({
          tom: "danger",
          titulo: "Não foi possível enviar o convite",
          descricao: err instanceof Error ? err.message : "Tente novamente.",
        });
        return false;
      }
    }
    return true;
  }

  return (
    <div className="mx-auto flex w-full max-w-[1056px] flex-col gap-6 px-5 py-8 sm:px-8 lg:max-w-none lg:px-12 lg:py-[70px] xl:px-[clamp(48px,13.5vw,259px)]">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          href="/escolas"
          className="inline-flex w-fit items-center gap-2 text-sm text-secondary transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Todas as escolas</span>
        </Link>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-2">
            <h1 className="font-(family-name:--font-text-me-one) text-3xl text-primary sm:text-4xl">
              {escola?.nome ?? "Escola"}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-surface-info px-3 py-0.5 text-xs font-medium text-ink">
                {professores.length}{" "}
                {professores.length === 1 ? "professor" : "professores"}
              </span>
              <span className="rounded-full bg-surface-success px-3 py-0.5 text-xs font-medium text-ink">
                {turmasDaEscolaList.length}{" "}
                {turmasDaEscolaList.length === 1 ? "turma" : "turmas"}
              </span>
            </div>
          </div>

          {!ehAdminRede ? (
            <div className="flex w-fit flex-col items-center rounded-[28px] bg-surface-base px-4 py-2.5">
              <span className="rounded-full bg-surface-warning px-4 py-0.5 text-xs font-medium text-ink">
                Código de acesso
              </span>
              <span className="mt-1.5 font-mono text-sm tracking-wider text-secondary">
                {escola?.codigoConvite || (escolaId ? `ESC-${escolaId.padStart(6, "0")}` : "---")}
              </span>
            </div>
          ) : null}
        </div>

        {/* Botões de ação */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {(
            [
              { id: "aluno", label: "Adicionar Alunos", iconSrc: AdcAlunosIcon.src },
              { id: "turma", label: "Adicionar Turmas", iconSrc: GroupAdd.src },
              { id: "professor", label: "Adicionar Professores", iconSrc: AdcProfIcon.src },
            ] as const
          )
            .filter((acao) => !(ehAdminRede && acao.id === "professor"))
            .map((acao) => (
            <Button
              key={acao.id}
              type="button"
              onClick={() => setModalAberto(acao.id)}
              className="flex w-auto flex-row items-center justify-center gap-2 px-3 py-1 sm:px-4 sm:py-1"
            >
              <img src={acao.iconSrc} className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" alt="" />
              <span className="whitespace-nowrap">{acao.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Card PEIs por Professor */}
      <div className="relative flex w-full flex-col gap-4 rounded-[44px] bg-surface-base px-6 py-6 sm:px-10 sm:py-7">
        <Encaracolado
          src={EncaracoladoDesenvolvimentoSvg.src}
          className="pointer-events-none absolute left-[-10px] top-1/2 max-h-[88%] w-[26px] -translate-y-1/2 aspect-[36/508] sm:left-[-12px] sm:w-[36px]"
        />

        <div className="flex flex-col gap-1.5">
          <h2 className="font-(family-name:--font-text-me-one) text-2xl text-primary sm:text-[26px]">
            PEIs por Professor
          </h2>
          <p className="text-sm text-secondary sm:text-base">
            Total de{" "}
            <span className="font-bold text-warning">
              {totalConcluidos}/{totalPeis}
            </span>{" "}
            PEIs concluídos
          </p>
          <div className="flex items-center gap-3">
            <div className="h-1.5 w-full max-w-md overflow-hidden rounded-full bg-sunken">
              <div
                className="h-full rounded-full bg-surface-warning transition-all duration-300"
                style={{ width: `${percentual}%` }}
              />
            </div>
            <span className="text-xs font-bold text-warning">{percentual}%</span>
          </div>
        </div>

        {/* Slots de professores */}
        <div className="flex max-h-[380px] flex-col gap-2.5 overflow-y-auto pr-2">
          {Array.from({ length: totalSlots }, (_, idx) => {
            const prof = professores[idx];
            if (!prof) {
              return (
                <div
                  key={`slot-vazio-${idx}`}
                  className="h-9 w-full shrink-0 rounded-full bg-surface-muted"
                />
              );
            }
            const concluido = prof.total > 0 && prof.concluidos >= prof.total;
            return (
              <div
                key={prof.id}
                className="flex h-9 w-full shrink-0 items-center gap-3 rounded-full bg-surface-muted px-4"
              >
                <span
                  className={`h-4 w-4 shrink-0 rounded-full ${
                    concluido ? "bg-surface-success-strong" : "bg-surface-warning-strong"
                  }`}
                  aria-hidden="true"
                />
                <span className="truncate text-[18px] text-primary">
                  {prof.nome} - {prof.turma} - {prof.concluidos}/{prof.total} concluídos
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-2 flex flex-col gap-0.5 text-[18px] text-[#797979]">
          <p>Último : {ultimoEnvio}</p>
          <p>Próx.: {proximoPeriodo}</p>
        </div>
      </div>

      {modalAberto === "aluno" && (
        <FormAluno
          turmas={turmasParaForm}
          onClose={() => setModalAberto(null)}
          onSalvar={aoCriarAluno}
        />
      )}

      {modalAberto === "turma" && (
        <FormTurma
          escolas={escolasParaForm}
          escolaIdInicial={escolaId}
          onClose={() => setModalAberto(null)}
          onSalvar={aoCriarTurma}
        />
      )}

      {modalAberto === "professor" && !ehAdminRede && (
        <FormProfessor
          turmas={turmasParaForm}
          onClose={() => setModalAberto(null)}
          onSalvar={(dados) => salvarProfessor(dados)}
        />
      )}

      {alerta ? <Toast alerta={alerta} limpar={limpar} /> : null}
    </div>
  );
}
