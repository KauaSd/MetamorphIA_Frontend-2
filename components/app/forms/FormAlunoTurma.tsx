"use client";

import { useState, useMemo } from "react";
import { saveProfessorPerfil, saveTeacherName } from "@/utils/data/controller";
import type { Resultado } from "@/utils/data/controller";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { OverlayCarregando } from "@/components/common/Carregando";
import { X, ChevronUp, ChevronDown, Check } from "lucide-react";
import CheckBoxAluno from "@/components/common/CheckBoxAl";
import DropDown, { type DropDownOption } from "@/components/common/DropDown";
import Blurfundo from "@/components/common/Blurfundo";
import Encaracolado from "@/components/common/Encaracolado";
import EncaracoladoIdentificaSvg from "@/public/encaracoladoindentifica.svg";

const COLUNAS_NEURO = [
  ["TEA", "TDAH", "Dislexia"],
  ["Discalculia", "AH/SD", "Outro"],
] as const;

export const COMPONENTES_CURRICULARES: DropDownOption[] = [
  { value: "Matemática", label: "Matemática" },
  { value: "L. Portuguesa", label: "L. Portuguesa" },
  { value: "História", label: "História" },
  { value: "L. Inglesa", label: "L. Inglesa" },
  { value: "Geografia", label: "Geografia" },
  { value: "Ciências", label: "Ciências" },
  { value: "Artes", label: "Artes" },
  { value: "Ed.Física", label: "Ed.Física" },
];

/** o que o form entrega para o handler salvar */
export interface DadosAluno {
  nome: string;
  idade: number | null;
  neuro: string[];
  turmaId: string;
  professorEspecializado?: string;
}

interface turmasprops {
  turmas: DropDownOption[];
  onClose: () => void;
  /** obrigatorio: sem ele o botao salvar nao teria para onde enviar os dados */
  onSalvar: (dados: DadosAluno) => Promise<Resultado>;
  modo?: "criar" | "editar";
  nomeInicial?: string;
  idadeInicial?: number | null;
  neuroInicial?: string[];
  turmaIdInicial?: string;
  professorEspecializadoInicial?: string;
}

export function FormAluno({
  turmas,
  onClose,
  onSalvar,
  modo = "criar",
  nomeInicial = "",
  idadeInicial = null,
  neuroInicial = [],
  turmaIdInicial = "",
  professorEspecializadoInicial = "",
}: turmasprops) {
  const [neuro, setNeuro] = useState<string[]>(neuroInicial);
  const [nome, setNome] = useState(nomeInicial);
  const [idade, setIdade] = useState(
    idadeInicial === null ? "" : String(idadeInicial)
  );
  const [turmaId, setTurmaId] = useState(
    turmaIdInicial || (turmas[0]?.value ?? "")
  );
  const [professorEspecializado, setProfessorEspecializado] = useState(
    professorEspecializadoInicial
  );
  const [salvando, setSalvando] = useState(false);

  const handleToggleNeuro = (item: string) => {
    setNeuro((prev) =>
      prev.includes(item)
        ? prev.filter((i) => i !== item)
        : [...prev, item]
    );
  };

  // soma ou subtrai um ano, chamado pelas setas do campo idade
  const handleIdadeStep = (direcao: 1 | -1) => {
    setIdade((prev) => {
      const atual = Number(prev);
      const novo = Number.isNaN(atual) ? 0 : atual + direcao;
      return String(Math.max(0, novo));
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (salvando) return;

    setSalvando(true);
    try {
      const resultado = await onSalvar({
        nome,
        idade: idade === "" ? null : Number(idade),
        neuro,
        turmaId,
        professorEspecializado: professorEspecializado.trim(),
      });

      // em caso de erro quem mostra a mensagem e o handler; o form continua aberto
      if (resultado.ok) {
        onClose();
      }
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Blurfundo onClose={salvando ? undefined : onClose}>
      <form
        onSubmit={handleSubmit}
        className="fixed inset-0 z-50 h-dvh w-screen sm:static sm:h-auto sm:w-full sm:max-w-md"
      >
        <div className="relative flex h-full w-full flex-col gap-4 overflow-y-auto rounded-none bg-surface-base p-5 shadow-md sm:h-auto sm:gap-6 sm:overflow-hidden sm:rounded-[70px] sm:p-8">
          <OverlayCarregando ativo={salvando} mensagem="Salvando aluno..." />
          <div className="flex flex-col gap-3 sm:gap-6">
            <div className="flex items-center justify-between">
              <p
                className={`text-3xl text-primary sm:text-4xl font-(family-name:--font-text-me-one)`}
              >
                {modo === "editar" ? "Editar Aluno" : "Dados do Aluno"}
              </p>
              <button
                type="button"
                aria-label="Fechar"
                className="cursor-pointer"
                onClick={onClose}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* campos nome, idade e neurodivergencias */}
          <div className="flex flex-col gap-2.5 sm:gap-3.5">
            <Input
              type="text"
              placeholder="Nome do aluno"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <div className="relative flex items-center justify-between w-32 sm:w-28 rounded-[70px] bg-sunken px-[0.7rem] py-[0.55rem]">
              <input
                type="number"
                placeholder="Idade"
                min="0"
                step="1"
                value={idade}
                onChange={(e) => setIdade(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key.length === 1 && !/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                className="w-full bg-transparent text-sm text-secondary outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
              <div className="flex flex-col justify-center -mr-1 -space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleIdadeStep(1)}
                  className="cursor-pointer text-secondary"
                >
                  <ChevronUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleIdadeStep(-1)}
                  className="cursor-pointer text-secondary"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-sm text-primary">
              Neurodivergência{" "}
              <span className="text-[10px] text-secondary font-normal">
                (selecione todas que se apliquem)
              </span>
            </p>
            <div className="grid grid-cols-2 gap-x-5 gap-y-2 sm:flex sm:flex-row sm:items-center sm:justify-center sm:gap-10">
              {COLUNAS_NEURO.map((coluna, idx) => (
                <div key={idx} className="flex flex-col gap-2">
                  {coluna.map((rotulo) => (
                    <div key={rotulo} className="relative flex w-full sm:inline-flex">
                      <Encaracolado
                        src={EncaracoladoIdentificaSvg.src}
                        className="pointer-events-none absolute -left-2.5 top-1/2 z-10 h-[38px] w-[20px] -translate-y-1/2"
                      />
                      <CheckBoxAluno
                        label={rotulo}
                        checked={neuro.includes(rotulo)}
                        onChange={() => handleToggleNeuro(rotulo)}
                        className="w-full sm:w-42"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <DropDown options={turmas} value={turmaId} onChange={setTurmaId} />
            <p className="text-sm text-primary">
              Professor de Educação Especializada{" "}
              <span className="text-[10px] text-secondary font-normal">
                (se houver)
              </span>
            </p>
            <Input
              type="text"
              placeholder="Nome do professor"
              value={professorEspecializado}
              onChange={(e) => setProfessorEspecializado(e.target.value)}
            />
          </div>

          {/* botoes cancelar e salvar */}
          <div className="mt-auto flex gap-5 pt-2 sm:mt-0 sm:pt-0">
            <Button
              type="button"
              onClick={onClose}
              disabled={salvando}
              className="bg-surface-inverse text-inverse hover:bg-surface-inverse-hover"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </form>
    </Blurfundo>
  );
}

const SERIES_ANO: DropDownOption[] = [
  { value: "1º ano", label: "1º ano" },
  { value: "2º ano", label: "2º ano" },
  { value: "3º ano", label: "3º ano" },
  { value: "4º ano", label: "4º ano" },
  { value: "5º ano", label: "5º ano" },
];

function parseNomeTurmaInicial(nomeInicial: string): {
  serieAno: string;
  letra: string;
  horario: string;
} {
  const limpo = nomeInicial.trim();
  if (!limpo) return { serieAno: "", letra: "", horario: "" };

  const partesHorario = limpo.split(/\s+-\s+/);
  const base = partesHorario[0]?.trim() ?? "";
  const horario = partesHorario.slice(1).join(" - ").trim();

  const matchSerie = [...SERIES_ANO]
    .sort((a, b) => b.value.length - a.value.length)
    .find((opt) => base.toLowerCase().startsWith(opt.value.toLowerCase()));

  if (matchSerie) {
    const letra = base.slice(matchSerie.value.length).trim();
    return { serieAno: matchSerie.value, letra, horario };
  }

  return { serieAno: base, letra: "", horario };
}

export interface DadosTurmaExtras {
  serieAno?: string;
  letra?: string;
  horario?: string;
}

interface FormTurmaProps {
  onClose: () => void;
  onSalvar: (
    nome: string,
    componentes?: string[],
    escolaId?: string,
    extras?: DadosTurmaExtras,
  ) => Promise<Resultado>;
  modo?: "criar" | "editar";
  nomeInicial?: string;
  serieAnoInicial?: string;
  letraInicial?: string;
  horarioInicial?: string;
  componentesIniciais?: string[];
  escolaIdInicial?: string;
  escolas?: DropDownOption[];
}

export function FormTurma({
  onClose,
  onSalvar,
  modo = "criar",
  nomeInicial = "",
  serieAnoInicial = "",
  letraInicial = "",
  horarioInicial = "",
  componentesIniciais = [],
  escolaIdInicial = "",
  escolas = [],
}: FormTurmaProps) {
  const inicial = useMemo(() => parseNomeTurmaInicial(nomeInicial), [nomeInicial]);
  const [serieAno, setSerieAno] = useState(serieAnoInicial || inicial.serieAno);
  const [letra, setLetra] = useState(letraInicial || inicial.letra);
  const [horario, setHorario] = useState(horarioInicial || inicial.horario);
  const [escolaId, setEscolaId] = useState(escolaIdInicial);
  const [materiasSelecionadas, setMateriasSelecionadas] = useState<string[]>(componentesIniciais);
  const [salvando, setSalvando] = useState(false);

  function alternarMateria(materia: string) {
    setMateriasSelecionadas((atual) =>
      atual.includes(materia) ? atual.filter((item) => item !== materia) : [...atual, materia],
    );
  }

  const opcoesSerieAno = useMemo(() => {
    if (!serieAno || SERIES_ANO.some((opt) => opt.value === serieAno)) {
      return SERIES_ANO;
    }
    return [{ value: serieAno, label: serieAno }, ...SERIES_ANO];
  }, [serieAno]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (salvando) return;

    const serieLimpa = serieAno.trim();
    const letraLimpa = letra.trim();
    const horarioLimpo = horario.trim();
    const nomeBase = serieLimpa
      ? [serieLimpa, letraLimpa].filter(Boolean).join(" ")
      : "";
    const nomeFinal = nomeBase
      ? [nomeBase, horarioLimpo].filter(Boolean).join(" - ")
      : "";

    setSalvando(true);
    try {
      // quem valida o nome vazio e o controller; o form so fecha se der ok
      const resultado = await onSalvar(
        nomeFinal,
        materiasSelecionadas,
        escolaId || undefined,
        {
          serieAno: serieLimpa || undefined,
          letra: letraLimpa,
          horario: horarioLimpo,
        },
      );
      if (resultado.ok) {
        onClose();
      }
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Blurfundo onClose={salvando ? undefined : onClose}>
      <form
        onSubmit={handleSubmit}
        className="fixed inset-0 z-50 h-dvh w-screen sm:static sm:h-auto sm:w-full sm:max-w-md"
      >
        <div className="relative flex h-full w-full flex-col gap-5 overflow-y-auto rounded-none bg-surface-base p-5 shadow-md sm:h-auto sm:gap-5 sm:overflow-visible sm:rounded-[50px] sm:p-8">
          <OverlayCarregando ativo={salvando} mensagem="Salvando turma..." />
          <div className="flex items-center justify-between">
            <p className="text-3xl text-primary sm:text-4xl font-(family-name:--font-text-me-one)">
              {modo === "editar" ? "Editar Turma" : "Dados da Turma"}
            </p>
            <button
              type="button"
              aria-label="Fechar"
              className="cursor-pointer"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1.25fr_1fr]">
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-primary">Série/Ano</p>
              <DropDown
                options={opcoesSerieAno}
                value={serieAno}
                onChange={setSerieAno}
                placeholder="ex.: 3º ano"
                maxVisibleItems={5}
                font="poppins"
                textSize="text-sm"
                itemHeight={34}
                itemGap={2}
                className={!serieAno ? "text-secondary" : undefined}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-primary">
                Letra{" "}
                <span className="text-[11px] font-normal text-secondary">
                  (opcional)
                </span>
              </p>
              <Input
                type="text"
                placeholder="ex.: A"
                value={letra}
                onChange={(e) => setLetra(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-sm text-primary">
              Horário{" "}
              <span className="text-[11px] font-normal text-secondary">
                (opcional)
              </span>
            </p>
            <Input
              type="text"
              placeholder="ex.: Manhã"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
            />
          </div>

          {!escolaIdInicial && escolas.length > 0 ? (
            <div className="flex flex-col gap-1.5">
              <p className="text-sm text-primary">Escola</p>
              <DropDown
                options={escolas}
                value={escolaId}
                onChange={setEscolaId}
                placeholder="Selecione a escola"
                maxVisibleItems={5}
                font="poppins"
                textSize="text-sm"
                itemHeight={34}
                itemGap={2}
                className={!escolaId ? "text-secondary" : undefined}
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-2">
            <p className="text-sm text-primary">
              Matérias da turma{" "}
              <span className="text-[11px] font-normal text-secondary">
                (aparecerão para o PEI)
              </span>
            </p>
            <div className="grid grid-cols-1 gap-x-4 gap-y-2.5 pl-2 sm:grid-cols-2">
              {MATERIAS_PROFESSOR.map((materia) => (
                <div key={materia} className="relative inline-flex w-full">
                  <Encaracolado
                    src={EncaracoladoIdentificaSvg.src}
                    className="pointer-events-none absolute -left-2.5 top-1/2 z-10 h-[34px] w-[18px] -translate-y-1/2"
                  />
                  <CheckBoxAluno
                    label={materia}
                    checked={materiasSelecionadas.includes(materia)}
                    onChange={() => alternarMateria(materia)}
                    className="w-full"
                    labelClassName="text-sm whitespace-nowrap"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto flex gap-4 sm:mt-2 sm:justify-end">
            <Button
              type="button"
              disabled={salvando}
              onClick={onClose}
              className="bg-surface-inverse text-inverse hover:bg-surface-inverse-hover sm:w-auto sm:px-7"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={salvando} className="sm:w-auto sm:px-8">
              {salvando ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </form>
    </Blurfundo>
  );
}

const MATERIAS_PROFESSOR = [
  "Matemática",
  "Ed. Física",
  "Ciências",
  "Artes",
  "L. Portuguesa",
  "História",
  "L. Inglesa",
  "Geografia",
] as const;

interface FormIdentificacaoProps {
  onSalvar?: () => Promise<void>;
}

export function FormIdentificacao({ onSalvar }: FormIdentificacaoProps) {
  const [nome, setNome] = useState("");
  const [salvando, setSalvando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (salvando) return;

    const nomeTrim = nome.trim();
    if (nomeTrim.length === 0) return;

    setSalvando(true);
    try {
      const resultado = await saveTeacherName(nomeTrim);
      if (resultado.ok && onSalvar) {
        await onSalvar();
      }
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Blurfundo>
      <form
        onSubmit={handleSubmit}
        className="fixed inset-0 z-50 h-dvh w-screen sm:static sm:h-auto sm:w-full sm:max-w-md"
      >
        <div className="relative flex h-full w-full flex-col gap-6 overflow-y-auto rounded-none bg-surface-base p-5 shadow-md sm:h-auto sm:gap-6 sm:overflow-hidden sm:rounded-[70px] sm:p-8">
          <OverlayCarregando ativo={salvando} mensagem="Salvando..." />
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className={`text-3xl text-primary sm:text-4xl font-(family-name:--font-text-me-one)`}>
                Identificação
              </p>
            </div>
            <p className="text-md text-primary">
              Como você gostaria que a IA te chamasse?
            </p>
            <p className="text-xs text-secondary">
              Você poderá trocar isso depois nas configurações.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <Input
              type="text"
              placeholder="Digite como a IA deve te chamar"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="mt-auto flex gap-5 sm:mt-0">
            <Button type="submit" disabled={salvando || nome.trim().length === 0}>
              Salvar
            </Button>
          </div>
        </div>
      </form>
    </Blurfundo>
  );
}

interface ModalConfirmarExclusaoProps {
  pergunta: string;
  onClose: () => void;
  onExcluir: () => Promise<Resultado>;
}

function ModalConfirmarExclusao({ pergunta, onClose, onExcluir }: ModalConfirmarExclusaoProps) {
  const [excluindo, setExcluindo] = useState(false);

  const handleExcluir = async () => {
    if (excluindo) return;
    setExcluindo(true);
    try {
      const resultado = await onExcluir();
      if (resultado.ok) {
        onClose();
      }
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <Blurfundo onClose={excluindo ? undefined : onClose}>
      <div className="fixed inset-0 z-50 h-dvh w-screen sm:static sm:h-auto sm:w-full sm:max-w-md">
        <div className="relative flex h-full w-full flex-col gap-6 overflow-y-auto rounded-none bg-surface-base p-5 shadow-md sm:h-auto sm:gap-6 sm:overflow-hidden sm:rounded-[70px] sm:p-8">
          <OverlayCarregando ativo={excluindo} mensagem="Excluindo..." />
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <p className={`text-3xl text-primary sm:text-4xl font-(family-name:--font-text-me-one)`}>
                Excluir
              </p>
              <button
                type="button"
                aria-label="Fechar"
                className="cursor-pointer"
                onClick={onClose}
              >
                <X className="w-6 h-6"/>
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-md text-primary text-justify">{pergunta}</p>
              <p className="text-xs text-secondary">Esta ação será permanente e não poderá ser revertida.</p>
            </div>
          </div>

          <div className="mt-auto flex gap-5 self-end sm:mt-0">
            <Button
              type="button"
              disabled={excluindo}
              className="bg-surface-inverse text-inverse hover:bg-surface-inverse-hover w-32"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={excluindo}
              onClick={handleExcluir}
              className="bg-surface-danger text-ink hover:bg-surface-danger/80 w-32 whitespace-nowrap"
            >
              {excluindo ? "Excluindo..." : "Excluir"}
            </Button>
          </div>
        </div>
      </div>
    </Blurfundo>
  );
}

interface FormDeletaAlunoProps {
  onClose: () => void;
  /** obrigatorio: sem ele o botao excluir nao teria o que confirmar */
  onExcluir: () => Promise<Resultado>;
  nomeAluno?: string;
}

export function FormDeletaAluno({ onClose, onExcluir, nomeAluno }: FormDeletaAlunoProps) {
  return (
    <ModalConfirmarExclusao
      pergunta={nomeAluno ? `Tem certeza de que deseja excluir ${nomeAluno}?` : "Tem certeza de que deseja excluir o aluno?"}
      onClose={onClose}
      onExcluir={onExcluir}
    />
  );
}

interface FormDeletaTurmaProps {
  onClose: () => void;
  /** obrigatorio: sem ele o botao excluir nao teria o que confirmar */
  onExcluir: () => Promise<Resultado>;
  nomeTurma?: string;
}

export function FormDeletaTurma({ onClose, onExcluir, nomeTurma }: FormDeletaTurmaProps) {
  return (
    <ModalConfirmarExclusao
      pergunta={nomeTurma ? `Tem certeza de que deseja excluir a turma ${nomeTurma}?` : "Tem certeza de que deseja excluir a turma?"}
      onClose={onClose}
      onExcluir={onExcluir}
    />
  );
}
