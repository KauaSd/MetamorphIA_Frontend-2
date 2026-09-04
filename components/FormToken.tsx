"use client";

import { useState } from "react";
import Input from "./Input";
import CheckBox from "./CheckBox";
import Button from "./Button";
import Link from 'next/link';
import { OTPInput, SlotProps } from "input-otp";

export default function FormRecuperaSenha() {
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