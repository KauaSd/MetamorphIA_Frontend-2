"use client";

import { useState } from "react";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { X } from "lucide-react";
import { useRef } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import CheckBoxAluno from "@/components/common/CheckBoxAl";
import  DropDown  from "@/components/common/DropDown";
import Blurfundo from "@/components/common/Blurfundo";
import { Text_Me_One } from "next/font/google";

interface turma{
  value : string
  label: string
}
interface turmasprops{
  turmas: turma[]
  onClose: () => void
}
export function FormAluno( { turmas, onClose } : turmasprops) {
  const inputRef = useRef<HTMLInputElement>(null);
    const [neuro, setNeuro] = useState<string[]>([])
    const [Nome, setNome] = useState("");
    const [ _ , setIdade] = useState("");


    const handleToggleNeuro = (item: string) => {
        setNeuro((prev) =>
        prev.includes(item)
            ? prev.filter((i) => i !== item) 
            : [...prev, item]                
        )
    }
      const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    };
  

  return (
    <Blurfundo onClose={onClose}>
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex w-full flex-col gap-10 rounded-[40px] bg-[#F0F0F0] p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
        <div className="flex flex-col  gap-6">
          <div className="flex items-center justify-between">
            <p
              className={`text-3xl text-[#433F3F] sm:text-4xl font-(family-name:--font-text-me-one)`}
            >
              Dados do Aluno
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

        <div className="flex flex-col gap-3.5">
          <Input
            type="text"
            placeholder="Nome do aluno"
            value={Nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <div className="relative flex items-center justify-between w-1/4 rounded-[70px] bg-[#D9D9D9] px-[0.7rem] py-[0.55rem]">
            <input
              ref={inputRef}
              type="number"
              placeholder="Idade"
              min="0"
              step="1"
              onChange={(e) => setIdade(e.target.value)}
              onKeyDown={(e) => {
                if (e.key.length === 1 && !/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              className="w-full bg-transparent text-sm text-[#797979] outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <div className="flex flex-col justify-center -mr-1 -space-y-1.5">
              <button
                type="button"
                onClick={() => inputRef.current?.stepUp()}
                className="cursor-pointer text-[#797979]"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => inputRef.current?.stepDown()}
                className="cursor-pointer text-[#797979]"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
            <p className="text-sm text-[#433F3F] text-justify">Neurodivergência</p>
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
            <DropDown isTurma options={turmas}/>
        </div>

        <div className="flex gap-5">
          <Button type="button" onClick={onClose} className="bg-[#433F3F] text-[#FFFDFA]">
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
  onCriar: () => void;
}

const TextMeOne = Text_Me_One({
  variable: "--font-text-me-one",
  weight: "400",
  subsets: ["latin"],
});

export function FormTurma({
  onClose,
  onCriar,
}: FormTurmaProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Blurfundo onClose={onClose}>
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex w-full flex-col gap-6 rounded-[40px] bg-[#FFFDFA] p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
        <div className="flex flex-col  gap-6">
          <div className="flex items-center justify-between">
          <p className={`${TextMeOne.variable} text-3xl text-[#433F3F] sm:text-4xl font-(family-name:--font-text-me-one)`}>Dados da Turma</p>
          <button
          type="button"
          aria-label="Fechar"
          className="cursor-pointer"
          onClick={onClose}
          >
            <X className="w-6 h-6"/>
          </button>
          </div>
          <p className="text-md text-[#433F3F] text-justify">Nome da turma</p>
        </div>

        <div className="flex flex-col items-center">
          <Input type="text" placeholder="ex.: 3º Ano A - Manhã" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="flex gap-5">
        <Button type="button" onClick={onClose} className="bg-[#433F3F] text-[#FFFDFA]">Cancelar</Button>
        <Button type="button" onClick={onCriar}>Salvar</Button>
      </div>
      </div>
    </form>
    </Blurfundo>
  );
}

export function FormIdentificacao() {
  const [Nome, setNome] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Blurfundo>
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex w-full flex-col gap-6 rounded-[40px] bg-[#FFFDFA] p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
        <div className="flex flex-col  gap-6">
          <div className="flex items-center justify-between">
          <p className={`text-3xl text-[#433F3F] sm:text-4xl font-(family-name:--font-text-me-one)`}>Identificação</p>
          <button
          type="button"
          aria-label="Fechar"
          className="cursor-pointer"
          >
            <X className="w-6 h-6"/>
          </button>
          </div>
          <p className="text-md text-[#433F3F] text-justify">Como devemos de te chamar?</p>
        </div>

        <div className="flex flex-col items-center">
          <Input type="text" placeholder="Digite seu nome completo" value={Nome} onChange={(e) => setNome(e.target.value)} />
        </div>

        <div className="flex gap-5">
        <Button type="button" className="bg-[#433F3F] text-[#FFFDFA]">Cancelar</Button>
        <Button type="button">Salvar</Button>
      </div>
      </div>
    </form>
    </Blurfundo>
  );
}

export function FormDeletaAluno() {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Blurfundo>
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex w-full flex-col gap-6 rounded-[40px] bg-[#FFFDFA] p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
        <div className="flex flex-col  gap-6">
          <div className="flex items-center justify-between">
          <p className={`text-3xl text-[#433F3F] sm:text-4xl font-(family-name:--font-text-me-one)`}>Excluir</p>
          <button
          type="button"
          aria-label="Fechar"
          className="cursor-pointer"
          >
            <X className="w-6 h-6"/>
          </button>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-md text-[#433F3F] text-justify">Tem certeza de que deseja excluir o aluno?</p>
            <p className="text-xs text-[#797979]">Esta ação será permanente e não poderá ser revertida.</p>
          </div>
        </div>

        <div className="flex gap-5 self-end">
            <Button type="button" className="bg-[#433F3F] text-[#FFFDFA] w-32">Cancelar</Button>
            <Button type="button" className="bg-[#FF9999] text-[#433F3F] w-32">Excluir</Button>
        </div>
      </div>
    </form>
    </Blurfundo>
  );
}

export function FormDeletaTurma() {

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Blurfundo>
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex w-full flex-col gap-6 rounded-[40px] bg-[#FFFDFA] p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
        <div className="flex flex-col  gap-6">
          <div className="flex items-center justify-between">
          <p className={`text-3xl text-[#433F3F] sm:text-4xl font-(family-name:--font-text-me-one)`}>Excluir</p>
          <button
          type="button"
          aria-label="Fechar"
          className="cursor-pointer"
          >
            <X className="w-6 h-6"/>
          </button>
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-md text-[#433F3F] text-justify">Tem certeza de que deseja excluir a turma?</p>
            <p className="text-xs text-[#797979]">Esta ação será permanente e não poderá ser revertida.</p>
          </div>
        </div>

        <div className="flex gap-5 self-end">
          <Button type="button" className="bg-[#433F3F] text-[#FFFDFA] w-32">Cancelar</Button>
          <Button type="button" className="bg-[#FF9999] text-[#433F3F] w-32">Excluir</Button>
      </div>
      </div>
    </form>
    </Blurfundo>
  );
}
