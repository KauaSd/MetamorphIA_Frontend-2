import Encaracolado from "@/components/common/Encaracolado";
import EncaracoladoSvg from "@/public/EncaracoladoEstatistica.svg";

type TipoStat = 1 | 2 | 3;

interface CardEstatisticaProps {
  tipo: TipoStat;
  valor: number | string;
  subtexto?: number | string;
}

const CONFIG_TIPOS = {
  1: {
    titulo: "Alunos cadastrados",
    corValor: "text-danger",
    formatarSubtexto: (val?: number | string) => `${val ?? 0} com PEI ativo`,
  },
  2: {
    titulo: "Neurodivergentes",
    corValor: "text-warning",
    formatarSubtexto: (val?: number | string) => `${val ?? 0}% da turma`,
  },
  3: {
    titulo: "Adaptações feitas",
    corValor: "text-accent",
    formatarSubtexto: () => "este mês",
  },
};

export default function CardEstatistica({ tipo, valor, subtexto }: CardEstatisticaProps) {
  const config = CONFIG_TIPOS[tipo] || CONFIG_TIPOS[1];

  return (
    <div className="font-(family-name:--font-poppins) relative flex min-h-24 w-full items-center rounded-[40px] bg-surface-raised p-4">
      <Encaracolado src={EncaracoladoSvg.src} className="absolute left-[-5] top-1/2 -translate-y-1/2 w-[24px] aspect-[31/96]" />

      <div className="flex flex-col justify-between h-full ml-4">
        <span className="text-xs sm:text-sm text-secondary">
          {config.titulo}
        </span>

        <span className={`text-lg sm:text-xl font-bold ${config.corValor}`}>
          {valor}
        </span>

        <span className="text-xs sm:text-sm text-secondary">
          {config.formatarSubtexto(subtexto)}
        </span>
      </div>
    </div>
  );
}
