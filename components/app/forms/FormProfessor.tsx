"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Blurfundo from "@/components/common/Blurfundo";
import Button from "@/components/common/Button";
import DropDown, { type DropDownOption } from "@/components/common/DropDown";
import Input from "@/components/common/Input";

interface FormProfessorProps {
  modo?: "criar" | "editar";
  emailInicial?: string;
  turmaInicial?: string;
  turmas: DropDownOption[];
  onClose: () => void;
  onSalvar: (dados: { email: string; turmaId: string }) => void;
}

export default function FormProfessor({
  modo = "criar",
  emailInicial = "",
  turmaInicial = "",
  turmas,
  onClose,
  onSalvar,
}: FormProfessorProps) {
  const [email, setEmail] = useState(emailInicial);
  const [turmaId, setTurmaId] = useState(turmaInicial);
  const ehEdicao = modo === "editar";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const emailLimpo = email.trim();
    if (!emailLimpo) return;
    onSalvar({ email: emailLimpo, turmaId });
  }

  return (
    <Blurfundo onClose={onClose}>
      <form
        onSubmit={handleSubmit}
        className="fixed inset-0 z-50 h-dvh w-screen sm:static sm:h-auto sm:w-full sm:max-w-md"
      >
        <div className="relative flex h-full w-full flex-col gap-5 rounded-none bg-surface-base p-5 sm:h-auto sm:rounded-[50px] sm:p-8">
          <div className="flex items-center justify-between">
            <p className="font-(family-name:--font-text-me-one) text-3xl text-primary sm:text-4xl">
              Dados do Professor
            </p>
            <button
              type="button"
              aria-label="Fechar"
              className="cursor-pointer"
              onClick={onClose}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-sm text-primary">Email do Professor</p>
            <Input
              type="email"
              placeholder="ex.: professorlegal@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={ehEdicao}
              className={ehEdicao ? "cursor-not-allowed opacity-70" : ""}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="text-sm text-primary">Turma que leciona</p>
            <DropDown
              options={
                turmas.length > 0 ? turmas : [{ value: "", label: "Sem turma" }]
              }
              value={turmaId}
              onChange={setTurmaId}
              placeholder="Selecione a turma"
              font="poppins"
              textSize="text-sm"
            />
          </div>

          <div className="mt-auto flex gap-4 sm:mt-2 sm:justify-center">
            <Button
              type="button"
              onClick={onClose}
              className="bg-surface-inverse text-inverse hover:bg-surface-inverse-hover sm:w-auto sm:px-7"
            >
              Cancelar
            </Button>
            <Button type="submit" className="sm:w-auto sm:px-8">
              Salvar
            </Button>
          </div>
        </div>
      </form>
    </Blurfundo>
  );
}
