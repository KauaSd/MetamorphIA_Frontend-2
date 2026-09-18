"use client";

import { useState } from "react";
import Input from "@/components/common/Input";
import CheckBox from "@/components/common/CheckBox";
import Button from "@/components/common/Button";
import Link from "next/link";
import { OTPInput, SlotProps } from "input-otp";

export function FormLogin() {
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
              <u>
                <b>Esqueci a senha</b>
              </u>
            </p>
          </Link>
        </div>
        <Link href="/chat">
          <Button type="submit">Entrar</Button>
        </Link>
        <div className="text-sm text-[#797979] flex flex-row items-center justify-center gap-1">
          <p> Não tem uma conta? </p>
          <Link href="/auth/cadastro">
            <p className="cursor-pointer">
              {" "}
              <u>
                <b>Cadastre-se</b>
              </u>{" "}
            </p>
          </Link>
        </div>
      </div>
    </form>
  );
}

export function FormCadastro() {
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
          <Input
            type="text"
            placeholder="Digite seu telefone"
            value={tel}
            onChange={(e) => setTel(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <div className="flex items-center">
          <CheckBox />
        </div>
        <Link href="/auth/login">
          <Button type="button">Cadastrar</Button>
        </Link>
        <div className="text-sm text-[#797979] flex flex-row items-center justify-center gap-1">
          <p>Já tem uma conta?</p>
          <Link href="/auth/login">
            <p className="cursor-pointer">
              {" "}
              <u>
                <b>Entre</b>
              </u>{" "}
            </p>
          </Link>
        </div>
      </div>
    </form>
  );
}

export function FormRecuperaSenha() {
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

export function FormToken() {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex w-full flex-col gap-6 rounded-[40px] bg-[#FFFDFA] p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
        <div className="flex flex-col items-center gap-6">
          <p className="text-2xl text-[#433F3F] sm:text-3xl text-center">Digite o código de verificação</p>
          <p className="text-sm text-[#797979] text-justify">Enviamos um código de 6 dígitos para seu e-mail/telefone. Por favor, insira-o abaixo.</p>
        </div>

        <div className="flex flex-col items-center">
          <OTPInput
        maxLength={6}
        value={value}
        onChange={setValue}
        containerClassName="flex gap-2"
        render={({ slots }) => (
          <div className="flex gap-4">
            {slots.map((slot, idx) => (
              <Slot key={idx} {...slot} />
            ))}
          </div>
        )}
      />
        </div>

        <div className="flex gap-5">
          <Link href="/auth/recuperaSenha" className="w-full">
            <Button type="button" className="bg-[#433F3F] text-[#FFFDFA]">Voltar</Button>
          </Link>
          <Button type="button">Verificar</Button>
        </div>
        </div>
      </form>
    );
}
function Slot( props: SlotProps){
    return(
    <div
      className={`w-10 h-14 flex items-center justify-center text-xl font-semibold bg-[#D9D9D9] rounded-full
      }`}
    >
      {props.char}
      {props.hasFakeCaret &&(
        <div className="absolute w-0.5 h-5 bg-[#433F3F] animate-caret-blink" />
      )}
    </div>
    )
}
