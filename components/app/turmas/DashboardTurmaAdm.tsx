"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  EllipsisVertical,
} from "lucide-react";
import BarraPesquisa from "@/components/common/Input";
import Button from "@/components/common/Button";
import DropDown from "@/components/common/DropDown";
import Encaracolado from "@/components/common/Encaracolado";
import TagNeuro from "@/components/common/TagNeuro";
import Toast, { useAlerta } from "@/components/common/Toast";
import VerMais from "@/components/common/VerMais";
import BoxSemAlunoTurma from "@/components/app/turmas/BoxSemAlunoTurma";
import {
  FormAluno,
  FormDeletaAluno,
  type DadosAluno,
} from "@/components/app/forms/FormAlunoTurma";
import Add from "@/public/add.svg";
import DescriptionIcon from "@/public/description.svg";
import DownloadIcon from "@/public/file_download.svg";
import type { Aluno, Turma } from "@/utils/data/types";
import type { Resultado } from "@/utils/data/controller";
import { baixarPeiAlunoPorFiltro, baixarPeisTurmaZip } from "@/utils/pei/service";

const BIMESTRES = [
  "1º Bimestre",
  "2º Bimestre",
  "3º Bimestre",
  "4º Bimestre",
] as const;

const MATERIAS = [
  "Matemática",
  "L. Portuguesa",
  "L. Inglesa",
  "Artes",
  "Ed. Física",
  "Ciências",
  "História",
  "Geografia",
  "Todas as matérias",
] as const;

const OPCOES_ORDENACAO = [
  { value: "az", label: "A-Z" },
  { value: "za", label: "Z-A" },
];

function MenuAnimado({
  children,
  className = "",
  role,
}: {
  children: React.ReactNode;
  className?: string;
  role?: string;
}) {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisivel(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      role={role}
      className={`origin-top transition-all duration-200 ease-out ${
        visivel
          ? "translate-y-0 scale-y-100 opacity-100"
          : "-translate-y-1 scale-y-95 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface DashboardTurmaAdmProps {
  turmaId: string;
  turma?: Turma;
  turmasParaForm: { value: string; label: string }[];
  alunosDaTurmaList: Aluno[];
  professorNome?: string | null;
  onCriarAluno: (dados: DadosAluno) => Promise<Resultado>;
  onEditarAluno: (id: string, dados: DadosAluno) => Promise<Resultado>;
  onExcluirAluno: (id: string) => Promise<Resultado>;
}

export default function DashboardTurmaAdm({
  turmaId,
  turma,
  turmasParaForm,
  alunosDaTurmaList,
  professorNome,
  onCriarAluno,
  onEditarAluno,
  onExcluirAluno,
}: DashboardTurmaAdmProps) {
  const { alerta, mostrar, limpar } = useAlerta();

  const [busca, setBusca] = useState("");
  const [ordenacao, setOrdenacao] = useState("az");
  const [mostrarForm, setMostrarForm] = useState(false);
  const [idEmEdicao, setIdEmEdicao] = useState<string | null>(null);
  const [idEmExclusao, setIdEmExclusao] = useState<string | null>(null);

  const [menuBaixarAberto, setMenuBaixarAberto] = useState(false);
  const [alunoMenuPeiId, setAlunoMenuPeiId] = useState<string | null>(null);
  const [bimestreSelecionado, setBimestreSelecionado] = useState<string | null>(null);
  const [alunoMenuAcoesId, setAlunoMenuAcoesId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setMenuBaixarAberto(false);
        setAlunoMenuPeiId(null);
        setAlunoMenuAcoesId(null);
      }
    }
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuBaixarAberto(false);
        setAlunoMenuPeiId(null);
        setAlunoMenuAcoesId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const alunosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const filtrados = termo
      ? alunosDaTurmaList.filter((a) => a.nome.toLowerCase().includes(termo))
      : alunosDaTurmaList;

    const descending = ordenacao === "za";
    return filtrados.toSorted((a, b) =>
      descending
        ? b.nome.localeCompare(a.nome, "pt-BR")
        : a.nome.localeCompare(b.nome, "pt-BR"),
    );
  }, [alunosDaTurmaList, busca, ordenacao]);

  const alunoEmEdicao = idEmEdicao
    ? alunosDaTurmaList.find((a) => a.id === idEmEdicao)
    : undefined;
  const alunoEmExclusao = idEmExclusao
    ? alunosDaTurmaList.find((a) => a.id === idEmExclusao)
    : undefined;

  async function handleBaixarPeis(escopo: "todos" | "bimestre") {
    setMenuBaixarAberto(false);
    const resultado = await baixarPeisTurmaZip(turma?.escolaId, turmaId, turma?.nome);
    if (!resultado.ok) {
      mostrar({
        tom: "danger",
        titulo: "Não foi possível baixar os PEIs",
        descricao: resultado.erro ?? "Tente novamente mais tarde.",
      });
      return;
    }
    mostrar({
      tom: "info",
      titulo: "Download iniciado",
      descricao:
        escopo === "todos"
          ? "Baixando arquivo .zip com todos os PEIs da turma."
          : "Baixando arquivo .zip dos PEIs da turma.",
    });
  }

  async function handleSelecionarMateria(
    aluno: Aluno,
    bimestre: string,
    materia: string,
  ) {
    setAlunoMenuPeiId(null);
    setBimestreSelecionado(null);
    const baixou = await baixarPeiAlunoPorFiltro(aluno, {
      bimestre,
      disciplina: materia,
    });
    if (!baixou) {
      mostrar({
        tom: "info",
        titulo: `PEI - ${aluno.nome}`,
        descricao: `Nenhum PEI disponível para ${bimestre} (${materia}).`,
      });
    }
  }

  return (
    <div
      ref={containerRef}
      className="mx-auto flex w-full max-w-[1056px] flex-col gap-6 px-5 py-8 sm:px-8 lg:max-w-none lg:px-12 lg:py-[70px] xl:px-[clamp(48px,13.5vw,259px)]"
    >
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          href="/turmas"
          className="inline-flex w-fit items-center gap-2 text-sm text-secondary transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Todas as turmas</span>
        </Link>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div className="flex flex-col gap-2">
            <h1 className="font-(family-name:--font-text-me-one) text-3xl text-primary sm:text-4xl">
              {turma?.nome ?? "Turma"}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-surface-info/45 px-3 py-0.5 text-xs font-medium text-primary">
                {alunosDaTurmaList.length}{" "}
                {alunosDaTurmaList.length === 1 ? "aluno" : "alunos"}
              </span>
              {professorNome ? (
                <span className="rounded-full bg-surface-warning px-3 py-0.5 text-xs font-medium text-ink">
                  {professorNome}
                </span>
              ) : null}
            </div>
          </div>

          <Button
            type="button"
            onClick={() => setMostrarForm(true)}
            className="flex w-auto flex-row items-center justify-center gap-2 px-4 py-1.5"
          >
            <img src={Add.src} className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" alt="" />
            <span className="whitespace-nowrap">Novo Aluno</span>
          </Button>
        </div>
      </div>

      {/* Seção Alunos + Controles */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <p className="font-(family-name:--font-text-me-one) text-2xl text-primary sm:text-3xl">
            Alunos
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <span className="hidden text-sm text-secondary sm:inline">Ordenar por</span>
            <DropDown
              options={OPCOES_ORDENACAO}
              value={ordenacao}
              onChange={setOrdenacao}
              small
            />

            <div className="relative">
              <Button
                type="button"
                onClick={() => setMenuBaixarAberto((prev) => !prev)}
                className="flex w-auto flex-row items-center justify-center gap-2 px-4 py-1.5"
              >
                <img src={DownloadIcon.src} className="h-4 w-4 shrink-0" alt="" />
                <span className="whitespace-nowrap">Baixar PEIs</span>
              </Button>

              {menuBaixarAberto ? (
                <MenuAnimado
                  role="menu"
                  className="absolute right-0 top-full z-30 mt-2 h-auto w-fit min-w-32 rounded-2xl bg-sunken p-1 text-primary shadow-lg"
                >
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleBaixarPeis("todos")}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 text-left text-base leading-none text-primary transition-colors duration-150 hover:bg-surface-base"
                    >
                      <Encaracolado
                        src={DescriptionIcon.src}
                        className="h-[14px] w-[14px] shrink-0"
                      />
                      <span>Todos</span>
                    </button>
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => handleBaixarPeis("bimestre")}
                      className="flex w-full cursor-pointer items-center gap-2 rounded-full px-3 py-1.5 text-left text-base leading-none text-primary transition-colors duration-150 hover:bg-surface-base"
                    >
                      <Encaracolado
                        src={DownloadIcon.src}
                        className="h-[14px] w-[14px] shrink-0"
                      />
                      <span className="whitespace-nowrap">Bim. atual</span>
                    </button>
                  </div>
                </MenuAnimado>
              ) : null}
            </div>
          </div>
        </div>

        <BarraPesquisa
          type="search"
          placeholder="Procurar alunos..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {/* Lista de Alunos */}
      {alunosDaTurmaList.length === 0 ? (
        <div className="flex w-full flex-1 items-center justify-center py-8">
          <BoxSemAlunoTurma onCriarAluno={() => setMostrarForm(true)} />
        </div>
      ) : alunosFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-1 rounded-[32px] bg-surface-base py-12">
          <p className="text-base text-secondary">Nenhum aluno encontrado</p>
          <p className="text-xs text-ink-muted">Tente outro termo de busca.</p>
        </div>
      ) : (
        <div className="w-full rounded-[32px] bg-surface-base px-6 py-2">
          <div className="divide-y divide-sunken">
            {alunosFiltrados.map((aluno) => {
              const menuPeiAberto = alunoMenuPeiId === aluno.id;
              const menuAcoesAberto = alunoMenuAcoesId === aluno.id;

              return (
                <div
                  key={aluno.id}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* Info do aluno */}
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <p className="truncate text-base font-medium text-primary sm:text-lg">
                        {aluno.nome}
                        {turma?.nome ? ` - ${turma.nome}` : ""}
                      </p>
                    </div>

                    {aluno.neuro.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {aluno.neuro.map((neuro, index) => (
                          <TagNeuro key={`${aluno.id}-${neuro}-${index}`} label={neuro} />
                        ))}
                      </div>
                    ) : null}
                  </div>

                  {/* Ações à direita */}
                  <div className="flex shrink-0 items-center gap-2 self-end sm:self-center">
                    {/* Dropdown PEIs por Bimestre */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setAlunoMenuAcoesId(null);
                          setBimestreSelecionado(null);
                          setAlunoMenuPeiId((prev) =>
                            prev === aluno.id ? null : aluno.id,
                          );
                        }}
                        className="flex cursor-pointer items-center gap-2 rounded-full bg-sunken px-4 py-1.5 text-sm text-primary transition-colors hover:bg-sunken-hover"
                      >
                        <span className="whitespace-nowrap">PEIs por Bimestre</span>
                        <ChevronDown
                          className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
                            menuPeiAberto ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {menuPeiAberto ? (
                        <div className="absolute right-0 top-full z-40 mt-2 flex items-start gap-2">
                          {/* Submenu de matérias à esquerda (abre ao clicar no bimestre) */}
                          {bimestreSelecionado ? (
                            <MenuAnimado
                              key={bimestreSelecionado}
                              className="flex w-44 flex-col gap-0.5 rounded-3xl bg-sunken p-1.5 shadow-lg"
                            >
                              {MATERIAS.map((materia) => (
                                <button
                                  key={materia}
                                  type="button"
                                  onClick={() =>
                                    void handleSelecionarMateria(
                                      aluno,
                                      bimestreSelecionado,
                                      materia,
                                    )
                                  }
                                  className="cursor-pointer rounded-full px-3 py-1 text-left text-xs text-primary transition-colors hover:bg-surface-base"
                                >
                                  {materia}
                                </button>
                              ))}
                            </MenuAnimado>
                          ) : null}

                          {/* Lista de bimestres */}
                          <MenuAnimado className="flex w-44 flex-col gap-0.5 rounded-3xl bg-sunken p-1.5 shadow-lg">
                            {BIMESTRES.map((bim) => {
                              const ativo = bimestreSelecionado === bim;
                              return (
                                <button
                                  key={bim}
                                  type="button"
                                  onClick={() =>
                                    setBimestreSelecionado((prev) =>
                                      prev === bim ? null : bim,
                                    )
                                  }
                                  className={`cursor-pointer rounded-full px-3 py-1.5 text-left text-sm transition-colors ${
                                    ativo
                                      ? "bg-surface-base font-medium text-primary"
                                      : "text-primary hover:bg-surface-base/70"
                                  }`}
                                >
                                  {bim}
                                </button>
                              );
                            })}
                          </MenuAnimado>
                        </div>
                      ) : null}
                    </div>

                    {/* Menu 3 pontinhos */}
                    <div className={`relative ${menuAcoesAberto ? "z-50" : "z-20"}`}>
                      <button
                        type="button"
                        onClick={() => {
                          setAlunoMenuPeiId(null);
                          setAlunoMenuAcoesId((prev) =>
                            prev === aluno.id ? null : aluno.id,
                          );
                        }}
                        aria-label={`Opções de ${aluno.nome}`}
                        aria-haspopup="menu"
                        aria-expanded={menuAcoesAberto}
                        className="flex cursor-pointer items-center justify-center text-primary"
                      >
                        <EllipsisVertical height="24px" />
                      </button>

                      {menuAcoesAberto ? (
                        <div className="absolute right-0 top-full z-50 mt-2">
                          <VerMais
                            onEditar={() => {
                              setAlunoMenuAcoesId(null);
                              setIdEmEdicao(aluno.id);
                            }}
                            onExcluir={() => {
                              setAlunoMenuAcoesId(null);
                              setIdEmExclusao(aluno.id);
                            }}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modais */}
      {mostrarForm ? (
        <FormAluno
          turmas={turmasParaForm}
          turmaIdInicial={turmaId}
          onClose={() => setMostrarForm(false)}
          onSalvar={onCriarAluno}
        />
      ) : null}

      {alunoEmEdicao ? (
        <FormAluno
          key={alunoEmEdicao.id}
          modo="editar"
          nomeInicial={alunoEmEdicao.nome}
          idadeInicial={alunoEmEdicao.idade}
          neuroInicial={alunoEmEdicao.neuro}
          turmaIdInicial={alunoEmEdicao.turmaId}
          turmas={turmasParaForm}
          onClose={() => setIdEmEdicao(null)}
          onSalvar={(dados) => onEditarAluno(alunoEmEdicao.id, dados)}
        />
      ) : null}

      {alunoEmExclusao ? (
        <FormDeletaAluno
          nomeAluno={alunoEmExclusao.nome}
          onClose={() => setIdEmExclusao(null)}
          onExcluir={() => onExcluirAluno(alunoEmExclusao.id)}
        />
      ) : null}

      {alerta ? <Toast alerta={alerta} limpar={limpar} /> : null}
    </div>
  );
}
