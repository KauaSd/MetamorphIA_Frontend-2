"use client";

import { useState } from "react";
import { saveTeacherName } from "@/utils/data/controller";
import type { Resultado } from "@/utils/data/controller";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { X } from "lucide-react";
import { ChevronUp, ChevronDown } from "lucide-react";
import CheckBoxAluno from "@/components/common/CheckBoxAl";
import  DropDown  from "@/components/common/DropDown";
import Blurfundo from "@/components/common/Blurfundo";

interface turma{
  value : string
  label: string
}

/** o que o form entrega para o handler salvar */
export interface DadosAluno {
  nome: string
  idade: number | null
  neuro: string[]
  turmaId: string
}

interface turmasprops{
  turmas: turma[]
  onClose: () => void
  /** obrigatorio: sem ele o botao salvar nao teria para onde enviar os dados */
  onSalvar: (dados: DadosAluno) => Promise<Resultado>
  modo?: "criar" | "editar"
  nomeInicial?: string
  idadeInicial?: number | null
  neuroInicial?: string[]
  turmaIdInicial?: string
}

export function FormAluno( { turmas, onClose, onSalvar, modo = "criar", nomeInicial="", idadeInicial=null, neuroInicial=[], turmaIdInicial="" } : turmasprops) {
    const [neuro, setNeuro] = useState<string[]>(neuroInicial);
    const [Nome, setNome] = useState(nomeInicial);
    const [idade, setIdade] = useState(idadeInicial === null ? "" : String(idadeInicial));
    const [turmaId, setTurmaId] = useState(turmaIdInicial || (turmas[0]?.value ?? ""));
    const [salvando, setSalvando] = useState(false);

    const handleToggleNeuro = (item: string) => {
        setNeuro((prev) =>
        prev.includes(item)
            ? prev.filter((i) => i !== item) 
            : [...prev, item]                
        )
    }

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
        nome: Nome,
        idade: idade === "" ? null : Number(idade),
        neuro,
        turmaId,
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
        <div className="flex flex-col  gap-6">
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
            value={Nome}
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
            <p className="text-sm text-primary text-justify">Neurodivergência</p>
            <div className="flex justify-center items-center gap-10">
              <div className="flex flex-col gap-1">
                <CheckBoxAluno 
                    label="TEA" 
                    checked={neuro.includes("TEA")} 
                    onChange={() => handleToggleNeuro('TEA')} 
                    />
                <CheckBoxAluno 
                    label="TDAH" 
                    checked={neuro.includes('TDAH')} 
                    onChange={() => handleToggleNeuro('TDAH')} 
                    />
                <CheckBoxAluno 
                    label="Dislexia" 
                    checked={neuro.includes('Dislexia')} 
                    onChange={() => handleToggleNeuro('Dislexia')} 
                    />
              </div>
              <div className="flex flex-col gap-1">
                <CheckBoxAluno 
                    label="Discalculia" 
                    checked={neuro.includes('Discalculia')} 
                    onChange={() => handleToggleNeuro('Discalculia')} 
                    />
                <CheckBoxAluno 
                    label="AH/SD" 
                    checked={neuro.includes('AH/SD')} 
                    onChange={() => handleToggleNeuro('AH/SD')} 
                    />
                <CheckBoxAluno 
                    label="Outro" 
                    checked={neuro.includes('Outro')} 
                    onChange={() => handleToggleNeuro('Outro')} 
                    />
              </div>
            </div>
            <DropDown options={turmas} value={turmaId} onChange={(v: string) => setTurmaId(v)} />
        </div>

        {/* botoes cancelar e salvar */}
        <div className="flex gap-5">
          <Button type="button" onClick={onClose} disabled={salvando} className="bg-surface-inverse text-inverse">
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

interface FormTurmaProps{
  onClose: () => void;
  onSalvar: (nome: string) => Promise<Resultado>;
  modo?: "criar" | "editar";
  nomeInicial?: string;
}

export function FormTurma({
  onClose,
  onSalvar,
  modo = "criar",
  nomeInicial = "",
}: FormTurmaProps) {
  const [nomeTurma, setNomeTurma] = useState(nomeInicial);
  const [salvando, setSalvando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (salvando) return;

    setSalvando(true);
    try {
      // quem valida o nome vazio e o controller; o form so fecha se der ok
      const resultado = await onSalvar(nomeTurma.trim());
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
        <div className="flex flex-col  gap-6">
          <div className="flex items-center justify-between">
          <p className="text-3xl text-primary sm:text-4xl font-(family-name:--font-text-me-one)">Dados da Turma</p>
          <button
          type="button"
          aria-label="Fechar"
          className="cursor-pointer"
          onClick={onClose}
          >
            <X className="w-6 h-6"/>
          </button>
          </div>
          <p className="text-md text-primary text-justify">Nome da turma</p>
        </div>

        <div className="flex flex-col items-center">
          <Input type="text" placeholder="ex.: 3º Ano A - Manhã" value={nomeTurma} onChange={(e) => setNomeTurma(e.target.value)} />
        </div>

        <div className="flex gap-5">
        <Button type="button" disabled={salvando} onClick={onClose} className="bg-surface-inverse text-inverse">Cancelar</Button>
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
  const [Nome, setNome] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nomeTrim = Nome.trim();
    if (nomeTrim.length === 0) return;
    const resultado = await saveTeacherName(nomeTrim);
    if (resultado.ok && onSalvar) {
      await onSalvar();
    }
  };

  return (
    <Blurfundo>
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex w-full flex-col gap-6 rounded-[40px] bg-surface-base p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
        <div className="flex flex-col  gap-6">
          <div className="flex items-center justify-between">
          <p className={`text-3xl text-primary sm:text-4xl font-(family-name:--font-text-me-one)`}>Identificação</p>
          </div>
          <p className="text-md text-primary text-justify">Como devemos te chamar?</p>
        </div>

        <div className="flex flex-col items-center">
          <Input type="text" placeholder="Digite seu nome completo" value={Nome} onChange={(e) => setNome(e.target.value)} />
        </div>

        <div className="flex gap-5">
        <Button type="submit">Salvar</Button>
      </div>
      </div>
    </form>
    </Blurfundo>
  );
}

interface FormDeletaAlunoProps{
  onClose: () => void;
  /** obrigatorio: sem ele o botao excluir nao teria o que confirmar */
  onExcluir: () => Promise<Resultado>;
  nomeAluno?: string;
}

export function FormDeletaAluno({onClose, onExcluir, nomeAluno}: FormDeletaAlunoProps) {
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
        <div className="flex flex-col  gap-6">
          <div className="flex items-center justify-between">
          <p className={`text-3xl text-primary sm:text-4xl font-(family-name:--font-text-me-one)`}>Excluir</p>
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
            <p className="text-md text-primary text-justify">
              {nomeAluno ? `Tem certeza de que deseja excluir ${nomeAluno}?` : "Tem certeza de que deseja excluir o aluno?"}
            </p>
            <p className="text-xs text-secondary">Esta ação será permanente e não poderá ser revertida.</p>
          </div>
        </div>

        <div className="flex gap-5 self-end">
            <Button type="button" disabled={excluindo} className="bg-surface-inverse text-inverse w-32" onClick={onClose}>Cancelar</Button>
            <Button type="button" disabled={excluindo} onClick={handleExcluir} className="bg-surface-danger text-ink w-32 whitespace-nowrap">
              {excluindo ? "Excluindo..." : "Excluir"}
            </Button>
        </div>
      </div>
    </div>
    </Blurfundo>
  );
}

interface FormDeletaTurmaProps{
  onClose: () => void;
  /** obrigatorio: sem ele o botao excluir nao teria o que confirmar */
  onExcluir: () => Promise<Resultado>;
  nomeTurma?: string;
}

export function FormDeletaTurma({onClose, onExcluir, nomeTurma}:FormDeletaTurmaProps) {
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
        <div className="flex flex-col  gap-6">
          <div className="flex items-center justify-between">
          <p className={`text-3xl text-primary sm:text-4xl font-(family-name:--font-text-me-one)`}>Excluir</p>
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
            <p className="text-md text-primary text-justify">
              {nomeTurma ? `Tem certeza de que deseja excluir a turma ${nomeTurma}?` : "Tem certeza de que deseja excluir a turma?"}
            </p>
            <p className="text-xs text-secondary">Esta ação será permanente e não poderá ser revertida.</p>
          </div>
        </div>

        <div className="flex gap-5 self-end">
          <Button type="button" disabled={excluindo} className="bg-surface-inverse text-inverse w-32" onClick={onClose}>Cancelar</Button>
          <Button type="button" disabled={excluindo} onClick={handleExcluir} className="bg-surface-danger text-ink w-32 whitespace-nowrap">
            {excluindo ? "Excluindo..." : "Excluir"}
          </Button>
      </div>
      </div>
    </div>
    </Blurfundo>
  );
}
