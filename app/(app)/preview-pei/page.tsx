"use client";

import Menu from "@/components/app/layout/Menu";
import PeisDisciplinaCard from "@/components/app/alunos/PeisDisciplinaCard";
import type { PeisPorDisciplinaResumo } from "@/utils/data/types";

const EXEMPLOS_PEI: Array<{ rotulo: string; dados: PeisPorDisciplinaResumo }> = [
  {
    rotulo: "1. Em andamento (0/5)",
    dados: {
      statusGeral: "EM ANDAMENTO",
      concluidos: 0,
      total: 5,
      disciplinas: [
        { id: "mat", disciplina: "Matemática", status: "nao_iniciado" },
        { id: "por", disciplina: "L. Portuguesa", status: "nao_iniciado" },
        { id: "cie", disciplina: "Ciências", status: "nao_iniciado" },
        { id: "ing", disciplina: "L. Inglesa", status: "nao_iniciado" },
        { id: "his", disciplina: "História", status: "nao_iniciado" },
      ],
      ultimoEnvio: "30/04/27",
      proximoPeriodo: "20/07 até 31/07/27",
    },
  },
  {
    rotulo: "2. Concluído (5/5)",
    dados: {
      statusGeral: "CONCLUÍDO",
      concluidos: 5,
      total: 5,
      disciplinas: [
        { id: "mat", disciplina: "Matemática", status: "concluido" },
        { id: "por", disciplina: "L. Portuguesa", status: "concluido" },
        { id: "cie", disciplina: "Ciências", status: "concluido" },
        { id: "ing", disciplina: "L. Inglesa", status: "concluido" },
        { id: "his", disciplina: "História", status: "concluido" },
      ],
      ultimoEnvio: "30/04/27",
      proximoPeriodo: "20/07 até 31/07/27",
    },
  },
  {
    rotulo: "3. Pendente (passou do tempo)",
    dados: {
      statusGeral: "PENDENTE",
      concluidos: 2,
      total: 5,
      atrasado: true,
      disciplinas: [
        { id: "mat", disciplina: "Matemática", status: "concluido" },
        { id: "por", disciplina: "L. Portuguesa", status: "em_andamento" },
        { id: "cie", disciplina: "Ciências", status: "nao_iniciado" },
        { id: "ing", disciplina: "L. Inglesa", status: "concluido" },
        { id: "his", disciplina: "História", status: "nao_iniciado" },
      ],
      ultimoEnvio: "30/04/25",
      proximoPeriodo: "20/07 até 31/07/25",
    },
  },
];

export default function PreviewPeiStatusPage() {
  return (
    <div className="flex min-h-screen w-full flex-row">
      <Menu />
      <main className="flex min-w-0 flex-1 flex-col">
        <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-6 px-6 py-10">
          <h1 className="font-(family-name:--font-text-me-one) text-2xl text-primary sm:text-3xl">
            Preview — Status de PEIs por Disciplina
          </h1>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {EXEMPLOS_PEI.map((exemplo) => (
              <div key={exemplo.rotulo} className="flex flex-col gap-2">
                <p className="font-(family-name:--font-poppins) text-xs font-medium text-secondary">
                  {exemplo.rotulo}
                </p>
                <PeisDisciplinaCard dados={exemplo.dados} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
