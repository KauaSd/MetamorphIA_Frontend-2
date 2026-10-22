"use client";

import { useState, useMemo } from "react";
import { saveTeacherName } from "@/utils/data/controller";
import type { Resultado } from "@/utils/data/controller";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { X, ChevronUp, ChevronDown } from "lucide-react";
import CheckBoxAluno from "@/components/common/CheckBoxAl";
import DropDown, { type DropDownOption } from "@/components/common/DropDown";
import Blurfundo from "@/components/common/Blurfundo";
import { useData } from "@/components/app/state/DataProvider";

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
    <Blurfundo onClose={onClose}>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="flex w-full flex-col gap-10 rounded-[40px] bg-surface-base p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
          <div className="flex flex-col gap-6">
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
          <div className="flex flex-col gap-3.5">
            <Input
              type="text"
              placeholder="Nome do aluno"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <div className="relative flex items-center justify-between w-1/4 rounded-[70px] bg-sunken px-[0.7rem] py-[0.55rem]">
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
            <div className="flex justify-center items-center gap-10">
              {COLUNAS_NEURO.map((coluna, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  {coluna.map((rotulo) => (
                    <CheckBoxAluno
                      key={rotulo}
                      label={rotulo}
                      checked={neuro.includes(rotulo)}
                      onChange={() => handleToggleNeuro(rotulo)}
                    />
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
          <div className="flex gap-5">
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

interface FormTurmaProps {
  onClose: () => void;
  onSalvar: (nome: string, componentes?: string[], escolaId?: string) => Promise<Resultado>;
  modo?: "criar" | "editar";
  nomeInicial?: string;
  componentesIniciais?: string[];
  escolaIdInicial?: string;
  escolas?: DropDownOption[];
}

export function FormTurma({
  onClose,
  onSalvar,
  modo = "criar",
  nomeInicial = "",
  componentesIniciais = [],
  escolaIdInicial = "",
  escolas: escolasProp,
}: FormTurmaProps) {
  const { escolas: escolasData } = useData();
  const [nomeTurma, setNomeTurma] = useState(nomeInicial);
  const [componentes, setComponentes] = useState<string[]>(componentesIniciais);
  const [escolaId, setEscolaId] = useState(escolaIdInicial);
  const [salvando, setSalvando] = useState(false);

  const listaEscolas = useMemo(() => {
    if (escolasProp) return escolasProp;
    return (escolasData ?? []).map((e) => ({ value: e.id, label: e.nome }));
  }, [escolasProp, escolasData]);

  const opcoesEscolas: DropDownOption[] = useMemo(() => {
    if (listaEscolas.length === 0) {
      return [{ value: "", label: "Sem escola" }];
    }
    return [
      { value: "", label: "Sem escola" },
      ...listaEscolas,
    ];
  }, [listaEscolas]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (salvando) return;

    setSalvando(true);
    try {
      // quem valida o nome vazio e o controller; o form so fecha se der ok
      const resultado = await onSalvar(
        nomeTurma.trim(),
        componentes,
        escolaId || undefined
      );
      if (resultado.ok) {
        onClose();
      }
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Blurfundo onClose={onClose}>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="flex w-full flex-col gap-6 rounded-[40px] bg-surface-base p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
          <div className="flex flex-col gap-6">
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
            <p className="text-sm text-primary">Nome da turma</p>
          </div>

          <div className="flex flex-col items-center">
            <Input
              type="text"
              placeholder="ex.: 3º Ano A - Manhã"
              value={nomeTurma}
              onChange={(e) => setNomeTurma(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm text-primary">
              Componente curricular{" "}
              <span className="text-[10px] text-secondary font-normal">
                (selecione todos que leciona)
              </span>
            </p>
            <DropDown
              options={COMPONENTES_CURRICULARES}
              multiple
              values={componentes}
              onMultiChange={setComponentes}
              placeholder="Selecione todos que leciona"
              maxVisibleItems={4}
              font="poppins"
              textSize="text-[15px]"
              itemHeight={32}
              itemGap={2}
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm text-primary">Escola</p>
            <DropDown
              options={opcoesEscolas}
              value={escolaId}
              onChange={setEscolaId}
              placeholder="Sem escola"
            />
          </div>

          <div className="flex gap-5">
            <Button
              type="button"
              disabled={salvando}
              onClick={onClose}
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
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="flex w-full flex-col gap-6 rounded-[40px] bg-surface-base p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <p className={`text-3xl text-primary sm:text-4xl font-(family-name:--font-text-me-one)`}>
                Identificação
              </p>
            </div>
            <p className="text-md text-primary text-justify">Como devemos te chamar?</p>
          </div>

          <div className="flex flex-col items-center">
            <Input
              type="text"
              placeholder="Digite seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div className="flex gap-5">
            <Button type="submit" disabled={salvando}>
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
    <Blurfundo onClose={onClose}>
      <div className="w-full max-w-md">
        <div className="flex w-full flex-col gap-6 rounded-[40px] bg-surface-base p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
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

          <div className="flex gap-5 self-end">
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
