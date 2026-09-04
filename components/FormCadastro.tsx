"use client";

import { useState } from "react";
import Input from "./Input";
import CheckBox from "./CheckBox";
import Button from "./Button";
import Link from 'next/link';

export default function FormCadastro() {
  const [tel, setTel] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex w-full flex-col gap-5 rounded-[40px] bg-[#FFFDFA] p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-sm text-[#797979]">Não tem uma conta?</h1>
          <p className="text-2xl text-[#433F3F] sm:text-3xl">Cadastre-se</p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Input type="text" placeholder="Digite seu telefone" value={tel} onChange={(e) => setTel(e.target.value)} />
          <Input type="text" placeholder="Digite seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Digite sua senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
        </div>

        <div className="flex flex-col items-center">
          <CheckBox />
        </div>

        <Button type="button">Cadastrar</Button>

        <div className="text-sm text-[#797979] flex flex-row items-center justify-center gap-1">
          <p>Já tem uma conta?</p>
          <Link href="/auth/login">
            <p className="cursor-pointer"> <u><b>Entre</b></u> </p>
          </Link>
        </div>
      </div>
    </form>
  );
}