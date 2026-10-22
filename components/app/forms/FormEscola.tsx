"use client";

import { useState } from "react";
import Blurfundo from "@/components/common/Blurfundo";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { X } from "lucide-react";
import type { Resultado } from "@/utils/data/controller";

interface FormEscolaProps {
  onClose: () => void;
  onSalvar: (nome: string) => Promise<Resultado>;
  nomeInicial?: string;
  modo?: "criar" | "editar";
}

export function FormEscola({
  onClose,
  onSalvar,
  nomeInicial = "",
  modo = "criar",
}: FormEscolaProps) {
  const [nomeEscola, setNomeEscola] = useState(nomeInicial);
  const [salvando, setSalvando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (salvando) return;

    setSalvando(true);
    try {
      const resultado = await onSalvar(nomeEscola);
      if (resultado.ok) {
        onClose();
      }
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Blurfundo onClose={onClose}>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="flex w-full flex-col gap-6 rounded-[40px] bg-surface-base p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <p className="text-3xl text-primary sm:text-4xl font-(family-name:--font-text-me-one)">
                {modo === "editar" ? "Editar Escola" : "Dados da Escola"}
              </p>
              <button
                type="button"
                aria-label="Fechar"
                className="cursor-pointer"
                onClick={onClose}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-sm text-primary">Nome da escola</p>
          </div>

          <div className="flex flex-col items-center">
            <Input
              type="text"
              placeholder="ex.: Escola Municipal Santos Dumont"
              value={nomeEscola}
              onChange={(e) => setNomeEscola(e.target.value)}
            />
          </div>

          <div className="flex gap-5">
            <Button
              type="button"
              disabled={salvando}
              onClick={onClose}
              className="bg-surface-inverse text-inverse hover:bg-surface-inverse-hover"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={salvando}>
              {salvando ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </form>
    </Blurfundo>
  );
}

interface FormDeletaEscolaProps {
  nomeEscola: string;
  onClose: () => void;
  onExcluir: () => Promise<Resultado>;
}

export function FormDeletaEscola({
  nomeEscola,
  onClose,
  onExcluir,
}: FormDeletaEscolaProps) {
  const [excluindo, setExcluindo] = useState(false);

  const handleExcluir = async () => {
    if (excluindo) return;
    setExcluindo(true);
    try {
      const resultado = await onExcluir();
      if (resultado.ok) {
        onClose();
      }
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <Blurfundo onClose={onClose}>
      <div className="w-full max-w-md">
        <div className="flex w-full flex-col gap-6 rounded-[40px] bg-surface-base p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
          <div className="flex items-center justify-between">
            <p className="text-3xl text-primary sm:text-4xl font-(family-name:--font-text-me-one)">
              Excluir Escola
            </p>
            <button
              type="button"
              aria-label="Fechar"
              className="cursor-pointer"
              onClick={onClose}
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-md text-primary text-justify">
              Tem certeza que deseja excluir a escola &quot;{nomeEscola}&quot;?
            </p>
            <p className="text-xs text-secondary">
              Esta ação excluirá permanentemente a escola e todas as turmas vinculadas a ela.
            </p>
          </div>

          <div className="flex gap-5 self-end">
            <Button
              type="button"
              disabled={excluindo}
              onClick={onClose}
              className="bg-surface-inverse text-inverse hover:bg-surface-inverse-hover w-32"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              disabled={excluindo}
              onClick={handleExcluir}
              className="bg-surface-danger text-ink hover:bg-surface-danger/80 w-32 whitespace-nowrap"
            >
              {excluindo ? "Excluindo..." : "Excluir"}
            </Button>
          </div>
        </div>
      </div>
    </Blurfundo>
  );
}
