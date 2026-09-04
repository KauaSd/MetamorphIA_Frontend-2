"use client";

import { useState } from "react";
import Input from "./Input";
import Button from "./Button";
import Link from 'next/link';


export default function FormLogin() {
  const [identificador, setIdentificar] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex w-full flex-col gap-5 rounded-[40px] bg-[#FFFDFA] p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-sm text-[#797979]">Já tem uma conta?</h1>
          <p className="text-2xl text-[#433F3F] sm:text-3xl">Entre</p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Input type="text" placeholder="Digite seu telefone ou e-mail" />
          <Input type="password" placeholder="Digite sua senha" />
        </div>

        <div className="flex flex-col items-end">
          <Link href="/auth/recuperaSenha">
            <p className="text-right text-sm text-[#797979]">
              <u><b>Esqueci a senha</b></u>
            </p>
          </Link>
        </div>

        <Button type="submit">Entrar</Button>

        <div className="text-sm text-[#797979] flex flex-row items-center justify-center gap-1">
            <p> Não tem uma conta? </p>
                <Link href="/auth/cadastro">
            <p className="cursor-pointer"> <u><b>Cadastre-se</b></u> </p>
        </Link>
        </div>
      </div>
    </form>
  );
}