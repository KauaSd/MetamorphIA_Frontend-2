"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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

interface turmasprops{
  turmas: turma[]
  onClose: () => void
  modo?: "criar" | "editar"
  nomeInicial?: string
}

export function FormAluno( { turmas, onClose, modo = "criar", nomeInicial="" } : turmasprops) {
    const [neuro, setNeuro] = useState<string[]>([])
    const [Nome, setNome] = useState("");
    const [idade, setIdade] = useState("");

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
      const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    };
  

  return (
    <Blurfundo onClose={onClose}>
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex w-full flex-col gap-10 rounded-[40px] bg-surface-muted p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
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
            <DropDown options={turmas}/>
        </div>

        {/* botoes cancelar e salvar */}
        <div className="flex gap-5">
          <Button type="button" onClick={onClose} className="bg-surface-inverse text-inverse">
            Cancelar
          </Button>
          <Button type="button">Salvar</Button>
        </div>
      </div>
    </form>
    </Blurfundo>
  );
}

interface FormTurmaProps{
  onClose: () => void;
  onSalvar: (nome: string) => Promise<{ ok: true } | { ok: false; erro: any }>;
  modo?: "criar" | "editar";
  nomeInicial?: string;
}

export function FormTurma({
  onClose,
  onSalvar,
  modo = "criar",
  nomeInicial = "",
}: FormTurmaProps) {
  const [nomeTurma, setNomeTurma] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        <Button type="button" onClick={onClose} className="bg-surface-inverse text-inverse">Cancelar</Button>
        <Button type="submit">Salvar</Button>
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
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nomeTrim = Nome.trim();
    if (nomeTrim.length === 0) return;
    try {
      const { saveTeacherName } = await import("@/utils/data/controller");
      await saveTeacherName(nomeTrim);
      if (onSalvar) {
        await onSalvar();
      }
      router.refresh();
    } catch (err) {
      console.error(err);
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
}

export function FormDeletaAluno({onClose}: FormDeletaAlunoProps) {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Blurfundo onClose={onClose}>
    <form onSubmit={handleSubmit} className="w-full max-w-md">
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
            <p className="text-md text-primary text-justify">Tem certeza de que deseja excluir o aluno?</p>
            <p className="text-xs text-secondary">Esta ação será permanente e não poderá ser revertida.</p>
          </div>
        </div>

        <div className="flex gap-5 self-end">
            <Button type="button" className="bg-surface-inverse text-inverse w-32" onClick={onClose}>Cancelar</Button>
            <Button type="button" className="bg-surface-danger text-ink w-32 whitespace-nowrap">Excluir</Button>
        </div>
      </div>
    </form>
    </Blurfundo>
  );
}

interface FormDeletaTurmaProps{
  onClose: () => void;
  onExcluir?: () => void;
}

export function FormDeletaTurma({onClose, onExcluir}:FormDeletaTurmaProps) {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Blurfundo onClose={onClose}>
    <form onSubmit={handleSubmit} className="w-full max-w-md">
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
            <p className="text-md text-primary text-justify">Tem certeza de que deseja excluir a turma?</p>
            <p className="text-xs text-secondary">Esta ação será permanente e não poderá ser revertida.</p>
          </div>
        </div>

        <div className="flex gap-5 self-end">
          <Button type="button" className="bg-surface-inverse text-inverse w-32" onClick={onClose}>Cancelar</Button>
          <Button type="button" className="bg-surface-danger text-ink w-32 whitespace-nowrap" onClick={onExcluir}>Excluir</Button>
      </div>
      </div>
    </form>
    </Blurfundo>
  );
}
