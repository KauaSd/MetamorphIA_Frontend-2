type TipoStat = 1 | 2;
interface ResumoProps{
    tipo: TipoStat
    txt: string
}
const CONFIG_TIPOS = {
  1: {
    titulo: "Resumo sobre a turma",
  },
  2: {
    titulo: "Perfil do Aluno",
  }
};
export default function Resumo(props : ResumoProps) {
    const config = CONFIG_TIPOS[props.tipo] || CONFIG_TIPOS[1];
    return(
        <div className="flex flex-col h-36 w-full rounded-[50px] py-5 px-13 bg-[#FFFDFA] gap-2">
            <div>
            <p className="font-(family-name:--font-text-me-one) text-3xl text-[#433F3F]"> {config.titulo} </p>
            </div>
        <div>
            <p className="font-(family-name:--font-poppins) text-[#797979] text-sm">{props.txt}</p>
        </div>
        </div>
    )
}