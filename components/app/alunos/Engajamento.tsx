import BarraPorcentagem from "@/components/common/BarraPorcentagem";
import type { EngajamentoMateria } from "@/utils/data/types";

type TipoStat = 1 | 2;

interface EngajamentoProps {
  tipo: TipoStat;
  /** quando ausente, usa os percentuais de exemplo */
  itens?: EngajamentoMateria[];
}

const CONFIG_TIPOS = {
  1: {
    titulo: "Engajamento por Área",
  },
  2: {
    titulo: "Perfil do Aluno",
  },
};

const ITENS_EXEMPLO: EngajamentoMateria[] = [
  { rotulo: "Leitura e Escrita", materia: "leitura", percentual: 62 },
  { rotulo: "Matemática", materia: "matematica", percentual: 78 },
  { rotulo: "Ciências", materia: "ciencias", percentual: 85 },
];

export default function Engajamento({ tipo, itens }: EngajamentoProps) {
  const config = CONFIG_TIPOS[tipo] || CONFIG_TIPOS[1];
  const areas = itens && itens.length > 0 ? itens : ITENS_EXEMPLO;

  return (
    <div className="flex flex-col gap-[16px]">
      <p className="font-(family-name:--font-text-me-one) text-xl sm:text-2xl"> {config.titulo} </p>
      {areas.map((area) => (
        <div key={area.materia}>
          <div className="flex w-full flex-row justify-between text-secondary">
            <p>{area.rotulo}</p>
            <p>{area.percentual}%</p>
          </div>
          <BarraPorcentagem value={area.percentual} materia={area.materia} />
        </div>
      ))}
    </div>
  );
}