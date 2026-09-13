"use client";

import { useState } from "react";
import Button from "./Button";
import { X } from 'lucide-react'
import Blurfundo from "./Blurfundo";

interface FormProps {
  onClose: () => void;
}

export default function FormDesconecta({onClose}: FormProps){

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <Blurfundo>
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex w-full flex-col gap-6 rounded-[40px] bg-[#FFFDFA] p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
        <div className="flex flex-col  gap-6">
          <div className="flex items-center justify-between">
          <p className={`text-3xl text-[#433F3F] sm:text-4xl font-(family-name:--font-text-me-one)`}>Desconectar</p>
          <BotaoFechar onClose={onClose} />
          </div>
          <div className="flex flex-col gap-3">
            <p className="text-md text-[#433F3F] text-justify">Tem certeza de que deseja desconectar de todos os dispositivos?</p>
            <p className="text-xs text-[#797979]">Esta ação será permanente e não poderá ser revertida.</p>
          </div>
        </div>

        <div className="flex gap-5 self-end">
            <Button type="button" onClick={onClose} className="bg-[#433F3F] text-[#FFFDFA] w-32">Cancelar</Button>
            <Button type="button" className="bg-[#FF9999] text-[#433F3F] w-32">Desconectar</Button>
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
      className="flex cursor-pointer hover:text-[#797979]"
    >
      <X className="h-6 w-6" />
    </button>
  );
}