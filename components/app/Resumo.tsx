import Encaracolado from "@/components/common/Encaracolado";
import EncaracoladoSvg from "@/public/EncaracoladoResumo.svg";

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
        <div className="relative flex min-h-28 w-full flex-col gap-2 rounded-[35px] bg-surface-base px-8 py-4">
            <Encaracolado src={EncaracoladoSvg.src} className="absolute left-[-10] top-1/2 -translate-y-1/2 w-[30px] aspect-[33/141]" />
            <div>
            <p className="font-(family-name:--font-text-me-one) text-xl text-primary sm:text-2xl"> {config.titulo} </p>
            </div>
        <div>
            <p className="font-(family-name:--font-poppins) text-secondary text-sm text-justify">{props.txt}</p>
        </div>
        </div>
    )
}
