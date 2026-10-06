"use client";

import Button from "@/components/common/Button";
import { X } from 'lucide-react'
import Blurfundo from "@/components/common/Blurfundo";
import { RegrasSenha } from "@/components/app/RegrasSenha";
import Input from "@/components/common/Input";
import { useState } from "react";
import Planos from "@/components/public/Planos";

interface FormProps {
  onClose: () => void;
}

export function FormDeletaConta({onClose}: FormProps){

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
          <BotaoFechar onClose={onClose} />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-md text-primary text-justify">Tem certeza de que deseja excluir a conta?</p>
            <p className="text-xs text-secondary">Esta ação será permanente e não poderá ser revertida.</p>
          </div>
        </div>

        <div className="flex gap-5 self-end">
            <Button type="button" onClick={onClose} className="bg-surface-inverse text-inverse w-32">Cancelar</Button>
            <Button type="button" className="bg-surface-danger text-ink w-32 whitespace-nowrap">Excluir</Button>
        </div>
      </div>
    </form>
    </Blurfundo>
  );
}

export function FormDesconectaTodos({onClose}: FormProps){

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Blurfundo onClose={onClose}>
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex w-full flex-col gap-6 rounded-[40px] bg-surface-base p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
        <div className="flex flex-col  gap-6">
          <div className="flex items-center justify-between">
          <p className={`text-3xl text-primary sm:text-4xl font-(family-name:--font-text-me-one)`}>Desconectar</p>
          <BotaoFechar onClose={onClose} />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-md text-primary text-justify">Tem certeza de que deseja desconectar de todos os dispositivos?</p>
            <p className="text-xs text-secondary">Esta ação será permanente e não poderá ser revertida.</p>
          </div>
        </div>

        <div className="flex gap-5 self-end">
            <Button type="button" onClick={onClose} className="bg-surface-inverse text-inverse">Cancelar</Button>
            <Button type="button" className="bg-surface-danger text-ink">Desconectar</Button>
        </div>
      </div>
    </form>
    </Blurfundo>
  );
}

export function FormDesconecta({onClose}: FormProps){

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Blurfundo onClose={onClose}>
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex w-full flex-col gap-6 rounded-[40px] bg-surface-base p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
        <div className="flex flex-col  gap-6">
          <div className="flex items-center justify-between">
          <p className={`text-3xl text-primary sm:text-4xl font-(family-name:--font-text-me-one)`}>Sair</p>
          <BotaoFechar onClose={onClose} />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-md text-primary text-justify">Tem certeza de que deseja sair deste dispositivo?</p>
            <p className="text-xs text-secondary">Esta ação será permanente e não poderá ser revertida.</p>
          </div>
        </div>

        <div className="flex gap-5 self-end">
            <Button type="button" onClick={onClose} className="bg-surface-inverse text-inverse">Cancelar</Button>
            <Button type="button" className="bg-surface-danger text-ink">Sair</Button>
        </div>
      </div>
    </form>
    </Blurfundo>
  );
}

export function FormAlterarSenha({onClose}: FormProps){
  const [senha, setSenha] = useState("");
  const [senha2, setSenha2] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Blurfundo onClose={onClose}>
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex w-full flex-col gap-6 rounded-[40px] bg-surface-base p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
        <div className="flex flex-col  gap-6">
          <div className="flex items-center justify-between">
          <p className={`text-3xl text-primary sm:text-4xl font-(family-name:--font-text-me-one)`}>Alterar Senha</p>
          <BotaoFechar onClose={onClose} />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-md text-primary text-justify">Digite sua nova senha:</p>
            <p className="text-xs text-secondary">Esta ação será permanente e não poderá ser revertida.</p>
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

        <div className="flex gap-5 self-end">
            <Button type="button" onClick={onClose} className="bg-surface-inverse text-inverse">Cancelar</Button>
            <Button type="button" className="bg-surface-danger text-ink">Salvar</Button>
        </div>
      </div>
    </form>
    </Blurfundo>
  );
}

export function FormPlanos({onClose}: FormProps){

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Blurfundo onClose={onClose}>
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex w-full flex-col gap-6 rounded-[40px] bg-surface-base p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
        <div className="flex flex-col  gap-6">
          <div className="flex items-center justify-between">
          <p className={`text-3xl text-primary sm:text-4xl font-(family-name:--font-text-me-one)`}>Planos</p>
          <BotaoFechar onClose={onClose} />
          </div>
          <div className="flex gap-10 mt-15 self-center">
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
