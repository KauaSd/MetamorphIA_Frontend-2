"use client";

import DropDown from "@/components/common/DropDown";
import AdicionarEscolaIcon from "@/public/adicionarEscola.svg";

interface HeaderPagEscolasProps {
  onCriarEscola: () => void;
  ordenacao?: string;
  onMudarOrdenacao?: (val: string) => void;
}

const OPCOES_DROPDOWN = [
  { value: "az", label: "A-Z" },
  { value: "za", label: "Z-A" },
];

export default function HeaderPagEscolas({
  onCriarEscola,
  ordenacao = "az",
  onMudarOrdenacao,
}: HeaderPagEscolasProps) {
  return (
    <div className="flex flex-col gap-[15px] w-full">
      <div className="flex flex-row items-center justify-between w-full gap-3">
        <p className="text-2xl sm:text-3xl font-(family-name:--font-text-me-one)">
          Escolas
        </p>

        <div className="flex flex-row gap-2 sm:gap-[13px] items-center shrink-0">
          <span className="hidden sm:inline text-sm text-secondary whitespace-nowrap">
            Ordenar por
          </span>
          <DropDown
            options={OPCOES_DROPDOWN}
            value={ordenacao}
            onChange={onMudarOrdenacao}
            small
          />

          <button
            type="button"
            onClick={onCriarEscola}
            aria-label="Criar Escola"
            className="flex w-8 h-8 sm:w-9 sm:h-9 bg-surface-accent rounded-full justify-center items-center cursor-pointer hover:bg-surface-accent-strong shrink-0"
          >
            <img src={AdicionarEscolaIcon.src} className="flex w-5 h-5 sm:w-6 sm:h-6 object-contain" alt="" />
          </button>
        </div>
      </div>
    </div>
  );
}
