import Encaracolado from "@/components/common/Encaracolado";
import EncaracoladoSvg from "@/public/EncaracoladoEstatistica.svg";

type TipoStat = 1 | 2 | 3;

interface CardEstatisticaProps {
  tipo: TipoStat;
  valor: number | string;
}

const CONFIG_TIPOS = {
  1: {
    titulo: "Atividades adaptadas",
    corValor: "text-danger",
  },
  2: {
    titulo: "Engajamento",
    corValor: "text-accent",
  },
  3: {
    titulo: "PEI gerado",
    corValor: "text-warning",
  },
};

export default function CardEstatistica({ tipo, valor }: CardEstatisticaProps) {
  const config = CONFIG_TIPOS[tipo] || CONFIG_TIPOS[1];

  return (
    <div className="font-(family-name:--font-poppins) relative flex min-h-24 w-full items-center rounded-[40px] bg-surface-base p-4">
      <Encaracolado src={EncaracoladoSvg.src} className="absolute left-[-5] top-1/2 -translate-y-1/2 w-[24px] aspect-[31/96]" />

      <div className="flex flex-col justify-between h-full ml-4">
        <span className="text-xs sm:text-sm text-secondary">
          {config.titulo}
        </span>

        <span className={`text-lg sm:text-xl font-bold ${config.corValor}`}>
          {valor}
        </span>
      </div>
    </div>
  );
}
