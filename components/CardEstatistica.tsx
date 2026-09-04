type TipoStat = 1 | 2 | 3;

interface CardEstatisticaProps {
  tipo: TipoStat;
  valor: number | string;
  subtexto?: number | string;
}

const CONFIG_TIPOS = {
  1: {
    titulo: "Alunos cadastrados",
    corValor: "text-[#FF8A8A]",
    formatarSubtexto: (val?: number | string) => `${val ?? 0} com PEI ativo`,
  },
  2: {
    titulo: "Neurodivergentes",
    corValor: "text-[#FFC164]",
    formatarSubtexto: (val?: number | string) => `${val ?? 0}% da turma`,
  },
  3: {
    titulo: "Adaptações feitas",
    corValor: "text-[#C5B4FF]",
    formatarSubtexto: () => "este mês",
  },
};

export default function CardEstatistica({ tipo, valor, subtexto }: CardEstatisticaProps) {
  const config = CONFIG_TIPOS[tipo] || CONFIG_TIPOS[1];

  return (
    <div className="font-(family-name:--font-poppins) relative flex items-center w-63 h-31.5 bg-[#FAF8F5] rounded-[70px] px-4 py-5">

      <div className="flex flex-col justify-between h-full ml-4">
        <span className="text-sm text-[#797979]">
          {config.titulo}
        </span>

        <span className={`text-[28px] font-bold ${config.corValor}`}>
          {valor}
        </span>

        <span className="text-sm text-[#797979]">
          {config.formatarSubtexto(subtexto)}
        </span>
      </div>
    </div>
  );
}