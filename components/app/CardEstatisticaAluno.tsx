import Encaracolado from "@/public/EncaracoladoEstatistica.svg";

type TipoStat = 1 | 2 | 3;

interface CardEstatisticaProps {
  tipo: TipoStat;
  valor: number | string;
}

const CONFIG_TIPOS = {
  1: {
    titulo: "Atividades adaptadas",
    corValor: "text-[#FF8A8A]",
  },
  2: {
    titulo: "Engajamento",
    corValor: "text-[#D4C7F8]",
  },
  3: {
    titulo: "PEI gerado",
    corValor: "text-[#FFD279]",
  },
};

export default function CardEstatistica({ tipo, valor }: CardEstatisticaProps) {
  const config = CONFIG_TIPOS[tipo] || CONFIG_TIPOS[1];

  return (
    <div className="font-(family-name:--font-poppins) relative flex min-h-25 w-full items-center rounded-[45px] bg-[#FAF8F5] px-4 py-5 sm:rounded-[70px]">
      <img src={Encaracolado.src} className="absolute left-[-5] top-1/2 -translate-y-1/2 w-[28px] h-auto pointer-events-none select-none" />

      <div className="flex flex-col justify-between h-full ml-4">
        <span className="text-sm text-[#797979]">
          {config.titulo}
        </span>

        <span className={`text-[28px] font-bold ${config.corValor}`}>
          {valor}
        </span>
      </div>
    </div>
  );
}
