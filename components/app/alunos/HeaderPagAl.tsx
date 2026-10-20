"use client";

import DropDown from "@/components/common/DropDown";

interface HeaderPagAlProps {
  ordenacao?: string;
  onOrdenacao?: (valor: string) => void;
}

const OPCOES_ORDENACAO = [
  { value: "az", label: "A-Z" },
  { value: "za", label: "Z-A" },
  { value: "recente", label: "Atividade" },
];

export default function HeaderPagAl({ ordenacao, onOrdenacao }: HeaderPagAlProps) {
  return (
    <div className="flex flex-col gap-[15px] w-full">
      <div className="flex flex-row items-center justify-between w-full gap-3">
        <p className="text-2xl sm:text-3xl font-(family-name:--font-text-me-one)">Alunos</p>
        <div className="flex flex-row gap-2 sm:gap-[13px] items-center shrink-0">
          <span className="hidden sm:inline text-sm text-secondary whitespace-nowrap">Ordenar por</span>
          <DropDown
            options={OPCOES_ORDENACAO}
            small
            value={ordenacao}
            onChange={onOrdenacao}
          />
        </div>
      </div>
    </div>
  );
}