"use client";

import { useState } from "react";
import Input from "./Input";
import CheckBox from "./CheckBox";
import Button from "./Button";
import Link from 'next/link';

export default function FormRecuperaSenha() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex w-full flex-col gap-6 rounded-[40px] bg-[#FFFDFA] p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
        <div className="flex flex-col items-center gap-6">
          <p className="text-2xl text-[#433F3F] sm:text-3xl">Recuperar senha</p>
          <p className="text-sm text-[#797979] text-justify">Para redefinir sua senha, informe seu número de telefone ou e-mail cadastrado na sua conta e lhe enviaremos um link  com as instruções.</p>
        </div>

        <div className="flex flex-col items-center">
          <Input type="text" placeholder="Digite seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="flex gap-5">
          <Link href="/auth/login" className="w-full">
            <Button type="button" className="bg-[#433F3F] text-[#FFFDFA]">Voltar</Button>
          </Link>
          <Link href="/auth/token" className="w-full">
            <Button type="button">Próximo</Button>
          </Link>
      </div>
      </div>
    </form>
  );
}