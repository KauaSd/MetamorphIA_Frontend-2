"use client";

import Button from "@/components/common/Button";
import { X } from 'lucide-react'
import Blurfundo from "@/components/common/Blurfundo";
import { RegrasSenha } from "@/components/app/auth/RegrasSenha";
import Input from "@/components/common/Input";
import { useState } from "react";
import Planos from "@/components/public/Planos";
import ButtonLink from "@/components/common/ButtonLink";
import { useRouter } from "next/navigation";

interface FormProps {
  onClose: () => void;
}

interface ModalConfirmacaoContaProps {
  titulo: string;
  pergunta: string;
  textoConfirmar: string;
  larguraFixa?: boolean;
  onClose: () => void;
}

function ModalConfirmacaoConta({
  titulo,
  pergunta,
  textoConfirmar,
  larguraFixa = false,
  onClose,
}: ModalConfirmacaoContaProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Blurfundo onClose={onClose}>
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex w-full flex-col gap-6 rounded-[40px] bg-surface-base p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
        <div className="flex flex-col  gap-6">
          <div className="flex items-center justify-between">
          <p className={`text-3xl text-primary sm:text-4xl font-(family-name:--font-text-me-one)`}>{titulo}</p>
          <BotaoFechar onClose={onClose} />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-md text-primary text-justify">{pergunta}</p>
            <p className="text-xs text-secondary">Esta ação será permanente e não poderá ser revertida.</p>
          </div>
        </div>

        <div className="flex gap-5 self-end">
            <Button type="button" onClick={onClose} className={`bg-surface-inverse text-inverse${larguraFixa ? " w-32" : ""}`}>Cancelar</Button>
            <Button type="button" className={`bg-surface-danger text-ink${larguraFixa ? " w-32 whitespace-nowrap" : ""}`}>{textoConfirmar}</Button>
        </div>
      </div>
    </form>
    </Blurfundo>
  );
}

export function FormDeletaConta({onClose}: FormProps){
  return (
    <ModalConfirmacaoConta
      titulo="Excluir"
      pergunta="Tem certeza de que deseja excluir a conta?"
      textoConfirmar="Excluir"
      larguraFixa
      onClose={onClose}
    />
  );
}

export function FormDesconectaTodos({onClose}: FormProps){
  return (
    <ModalConfirmacaoConta
      titulo="Desconectar"
      pergunta="Tem certeza de que deseja desconectar de todos os dispositivos?"
      textoConfirmar="Desconectar"
      onClose={onClose}
    />
  );
}

export function FormDesconecta({onClose}: FormProps){
  return (
    <ModalConfirmacaoConta
      titulo="Sair"
      pergunta="Tem certeza de que deseja sair deste dispositivo?"
      textoConfirmar="Sair"
      onClose={onClose}
    />
  );
}

export function FormAlterarSenha({onClose}: Partial<FormProps>){
  const router = useRouter();
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!onClose) {
      router.push("/auth/senhaAlterada");
    }
  };

  const formulario = (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex w-full flex-col gap-6 rounded-[40px] bg-surface-base p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
        <div className="flex flex-col  gap-6">
          <div className={`flex items-center ${onClose ? "justify-between" : "justify-center"}`}>
            <p className={onClose
                ? "text-3xl text-primary sm:text-4xl font-(family-name:--font-text-me-one)"
                : "text-2xl text-primary sm:text-3xl text-center"
              }>Alterar Senha</p>
            {onClose && <BotaoFechar onClose={onClose} />}
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-md text-primary text-justify">Digite sua nova senha:</p>
            <p className="text-xs text-secondary"> Esta ação será permanente e não poderá ser revertida.</p>
            <Input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}  
            />
            <RegrasSenha senha={senha} />
            <p className="text-md text-primary text-justify">Confirme sua nova senha:</p>
            <Input
              type="password"
              placeholder="Digite sua senha"
              value={senha2}
              onChange={(e) => setSenha2(e.target.value)}  
            />
          </div>
        </div>

        <div className={`flex gap-5 ${onClose ? "self-end" : "justify-center"}`}>
          {onClose ? (
            <Button type="button" onClick={onClose} className="bg-surface-inverse text-inverse">Cancelar</Button>
          ) : (
            <ButtonLink href="/auth/token" className="bg-surface-inverse text-inverse">Cancelar</ButtonLink>
          )}
          <Button type="submit" className="bg-surface-danger text-ink">Salvar</Button>
        </div>
      </div>
    </form>
  );

  return onClose ? <Blurfundo onClose={onClose}>{formulario}</Blurfundo> : formulario;
}

export function FormPlanos({onClose}: FormProps){

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Blurfundo onClose={onClose}>
    <form onSubmit={handleSubmit} className="w-full max-w-[min(95vw,1100px)]">
      <div className="flex w-full flex-col gap-6 rounded-[40px] bg-surface-base p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
        <div className="flex flex-col  gap-6">
          <div className="flex items-center justify-between">
          <p className={`text-3xl text-primary sm:text-4xl font-(family-name:--font-text-me-one)`}>Planos</p>
          <BotaoFechar onClose={onClose} />
          </div>
          <div className="flex flex-wrap items-stretch justify-center gap-6 md:gap-10 mt-6 md:mt-10 max-w-full">
              <Planos tipo="pro"/>
              <Planos tipo="institucional"/>
          </div>

        </div>
      </div>
    </form>
    </Blurfundo>
  );
}

function BotaoFechar({onClose}: { onClose: () => void;}) 
{
  return (
    <button
      type="button"
      aria-label="Fechar"
      onClick={onClose}
      className="flex cursor-pointer hover:text-secondary"
    >
      <X className="h-6 w-6" />
    </button>
  );
}
