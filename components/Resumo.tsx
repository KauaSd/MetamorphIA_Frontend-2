import Encaracolado from "@/public/EncaracoladoResumo.svg";

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
        <div className="relative flex min-h-36 w-full flex-col gap-2 rounded-[35px] bg-[#FFFDFA] px-10 py-5 sm:rounded-[50px] sm:px-13">
            <img src={Encaracolado.src} className="absolute left-[-10] top-1/2 -translate-y-1/2 w-[30px] h-auto pointer-events-none select-none" />
            <div>
            <p className="font-(family-name:--font-text-me-one) text-2xl text-[#433F3F] sm:text-3xl"> {config.titulo} </p>
            </div>
        <div>
            <p className="font-(family-name:--font-poppins) text-[#797979] text-sm text-justify">{props.txt}</p>
        </div>
        </div>
    )
}
