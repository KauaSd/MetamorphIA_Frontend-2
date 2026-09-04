"use client";

import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import { X } from 'lucide-react'
import { Text_Me_One } from "next/font/google";

const TextMeOne = Text_Me_One({
  variable: "--font-text-me-one",
  weight: "400",
  subsets: ["latin"],
});

export default function FormRecuperaSenha() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex w-full flex-col gap-6 rounded-[40px] bg-[#FFFDFA] p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
        <div className="flex flex-col  gap-6">
          <div className="flex items-center justify-between">
          <p className={`${TextMeOne.variable} text-3xl text-[#433F3F] sm:text-4xl font-(family-name:--font-text-me-one)`}>Dados da Turma</p>
          <button
          type="button"
          aria-label="Fechar"
          className="cursor-pointer"
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
        <Button type="button" className="bg-[#433F3F] text-[#FFFDFA]">Cancelar</Button>
        <Button type="button">Salvar</Button>
      </div>
      </div>
    </form>
  );
}