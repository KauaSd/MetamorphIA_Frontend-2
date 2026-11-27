"use client";

import { useRef, useState } from "react";
import { ChevronDown, X } from "lucide-react";
import Blurfundo from "@/components/common/Blurfundo";
import Button from "@/components/common/Button";
import { OverlayCarregando } from "@/components/common/Carregando";
import CheckBoxAluno from "@/components/common/CheckBoxAl";
import Encaracolado from "@/components/common/Encaracolado";
import Input from "@/components/common/Input";
import EncaracoladoIdentificaSvg from "@/public/encaracoladoindentifica.svg";

const MATERIAS_TURMA = [
  "Matemática",
  "Ed. Física",
  "Ciências",
  "Artes",
  "L. Portuguesa",
  "História",
  "L. Inglesa",
  "Geografia",
] as const;

export interface TurmaFormProfessorOption {
  value: string;
  label: string;
  disciplinas?: string[];
}

export interface VinculoTurmaProfessor {
  turmaId: string;
  disciplinas: string[];
}

interface FormProfessorProps {
  modo?: "criar" | "editar";
  emailInicial?: string;
  turmaInicial?: string;
  disciplinasIniciais?: string[];
  turmas: TurmaFormProfessorOption[];
  onClose: () => void;
  onSalvar: (dados: {
    email: string;
    disciplinas: string[];
    vinculos: VinculoTurmaProfessor[];
  }) => Promise<boolean | void> | boolean | void;
}

export default function FormProfessor({
  modo = "criar",
  emailInicial = "",
  turmaInicial = "",
  disciplinasIniciais = [],
  turmas,
  onClose,
  onSalvar,
}: FormProfessorProps) {
  const [email, setEmail] = useState(emailInicial);
  const [salvando, setSalvando] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [turmaAbertaId, setTurmaAbertaId] = useState<string | null>(
    turmaInicial || turmas[0]?.value || null,
  );
  const [turmasLecionadas, setTurmasLecionadas] = useState<Record<string, boolean>>(() =>
    turmaInicial ? { [turmaInicial]: true } : {},
  );
  const [disciplinasPorTurma, setDisciplinasPorTurma] = useState<Record<string, string[]>>(() =>
    turmaInicial && disciplinasIniciais.length > 0
      ? { [turmaInicial]: disciplinasIniciais }
      : {},
  );
  const ehEdicao = modo === "editar";

  function alternarTurmaAberta(id: string) {
    setTurmaAbertaId((atual) => (atual === id ? null : id));
  }

  function alternarLecionaTurma(turmaId: string) {
    setTurmasLecionadas((atual) => {
      const proximo = !atual[turmaId];
      if (!proximo) {
        setDisciplinasPorTurma((prev) => {
          const copia = { ...prev };
          delete copia[turmaId];
          return copia;
        });
      }
      return { ...atual, [turmaId]: proximo };
    });
  }

  function alternarDisciplina(turmaId: string, materia: string) {
    setTurmasLecionadas((atual) => ({ ...atual, [turmaId]: true }));
    setDisciplinasPorTurma((atual) => {
      const lista = atual[turmaId] ?? [];
      const proxima = lista.includes(materia)
        ? lista.filter((m) => m !== materia)
        : [...lista, materia];
      return { ...atual, [turmaId]: proxima };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (salvando) return;
    const emailLimpo = email.trim();
    if (!emailLimpo) {
      emailInputRef.current?.focus();
      return;
    }

    const vinculos: VinculoTurmaProfessor[] = turmas
      .filter((t) => Boolean(turmasLecionadas[t.value]))
      .map((t) => ({
        turmaId: t.value,
        disciplinas: disciplinasPorTurma[t.value] ?? [],
      }));

    const disciplinas = Array.from(
      new Set(vinculos.flatMap((v) => v.disciplinas)),
    );

    setSalvando(true);
    try {
      const sucesso = await onSalvar({ email: emailLimpo, disciplinas, vinculos });
      if (!ehEdicao && sucesso !== false) {
        setEmail("");
        setTurmasLecionadas({});
        setDisciplinasPorTurma({});
        setTurmaAbertaId(turmas[0]?.value || null);
        requestAnimationFrame(() => {
          emailInputRef.current?.focus();
        });
      }
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Blurfundo onClose={salvando ? undefined : onClose}>
      <form
        onSubmit={handleSubmit}
        className="fixed inset-0 z-50 h-dvh w-screen sm:static sm:h-auto sm:w-full sm:max-w-2xl"
      >
        <div className="relative flex h-full w-full flex-col gap-5 overflow-y-auto rounded-none bg-surface-base p-5 sm:h-auto sm:max-h-[90vh] sm:overflow-hidden sm:rounded-[50px] sm:p-8">
          <OverlayCarregando
            ativo={salvando}
            mensagem={ehEdicao ? "Salvando..." : "Enviando convite..."}
          />
          <div className="flex items-center justify-between">
            <p className="font-(family-name:--font-text-me-one) text-3xl text-primary sm:text-4xl">
              Dados do Professor
            </p>
            <button
              type="button"
              aria-label="Fechar"
              className="cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              disabled={salvando}
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-sm text-primary">Email do Professor</p>
            <Input
              inputRef={emailInputRef}
              type="email"
              placeholder="ex.: professorlegal@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={ehEdicao || salvando}
              className={ehEdicao ? "cursor-not-allowed opacity-70" : ""}
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm text-primary">
              Turmas e matérias que leciona{" "}
              <span className="text-xs font-normal text-secondary">
                (clique em uma turma para escolher as matérias)
              </span>
            </p>

            {turmas.length === 0 ? (
              <p className="rounded-3xl bg-sunken px-5 py-3 text-sm text-secondary">
                Nenhuma turma cadastrada nesta escola ainda.
              </p>
            ) : (
              <div className="flex max-h-72 flex-col gap-2 overflow-y-auto pr-1">
                {turmas.map((turma) => {
                  const aberta = turmaAbertaId === turma.value;
                  const leciona = Boolean(turmasLecionadas[turma.value]);
                  const selecionadas = disciplinasPorTurma[turma.value] ?? [];
                  const materiasDisponiveis =
                    turma.disciplinas && turma.disciplinas.length > 0
                      ? turma.disciplinas
                      : MATERIAS_TURMA;

                  return (
                    <div
                      key={turma.value}
                      className="shrink-0 overflow-hidden rounded-3xl bg-sunken border-0 transition-colors"
                    >
                      <div className="flex w-full items-center justify-between gap-3 px-5 py-2.5 transition-colors hover:bg-sunken-hover">
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <button
                            type="button"
                            aria-label={`Leciona em ${turma.label}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              alternarLecionaTurma(turma.value);
                            }}
                            className={`flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-md transition-colors ${
                              leciona
                                ? "bg-surface-secondary text-inverse-muted"
                                : "bg-surface-base/70"
                            }`}
                          >
                            {leciona ? (
                              <svg
                                className="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            ) : null}
                          </button>

                          <button
                            type="button"
                            onClick={() => alternarTurmaAberta(turma.value)}
                            className="flex min-w-0 flex-1 cursor-pointer items-center justify-between gap-3 text-left"
                          >
                            <span className="truncate text-sm font-medium text-primary">
                              {turma.label}
                            </span>
                            <div className="flex shrink-0 items-center gap-2.5">
                              <span className="text-xs text-secondary">
                                {!leciona
                                  ? "Não leciona"
                                  : selecionadas.length === 0
                                    ? "Leciona (sem matérias)"
                                    : selecionadas.length === 1
                                      ? "1 matéria"
                                      : `${selecionadas.length} matérias`}
                              </span>
                              <ChevronDown
                                className={`h-5 w-5 shrink-0 text-primary transition-transform duration-300 ease-out ${
                                  aberta ? "rotate-180" : ""
                                }`}
                                strokeWidth={2.5}
                              />
                            </div>
                          </button>
                        </div>
                      </div>

                      {aberta ? (
                        <div className="px-5 pb-4 pt-2">
                          <p className="mb-2.5 text-xs text-secondary">
                            Matérias que leciona em <strong className="text-primary">{turma.label}</strong>{" "}
                            (aparecerão no PEI):
                          </p>
                          <div className="grid grid-cols-1 gap-x-4 gap-y-2.5 pl-2 sm:grid-cols-2 lg:grid-cols-3">
                            {materiasDisponiveis.map((materia) => (
                              <div
                                key={`${turma.value}-${materia}`}
                                className="relative inline-flex w-full"
                              >
                                <Encaracolado
                                  src={EncaracoladoIdentificaSvg.src}
                                  className="pointer-events-none absolute -left-2.5 top-1/2 z-10 h-[34px] w-[18px] -translate-y-1/2"
                                />
                                <CheckBoxAluno
                                  label={materia}
                                  checked={selecionadas.includes(materia)}
                                  onChange={() => alternarDisciplina(turma.value, materia)}
                                  className="w-full pl-5"
                                  labelClassName="text-sm whitespace-nowrap"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-auto flex gap-4 sm:mt-2 sm:justify-center">
            <Button
              type="button"
              disabled={salvando}
              onClick={onClose}
              className="bg-surface-inverse text-inverse hover:bg-surface-inverse-hover sm:w-auto sm:px-7"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={salvando} className="sm:w-auto sm:px-8">
              Salvar
            </Button>
          </div>
        </div>
      </form>
    </Blurfundo>
  );
}
