import TagNeuro  from "@/components/common/TagNeuro";
import { EllipsisVertical } from 'lucide-react';
import { pegainicial } from '@/utils/pegariniciais'
interface AlunoProps{
    nome: string
    Neuro: string
    Turma: string
    index: number
}
export default function Aluno( props: AlunoProps) {
    const coresPerfil = [
        "bg-[#CEFFCA]", "bg-[#FF9999]", "bg-[#D4C7F8]", "bg-[#CAF3FF]", "bg-[#FFD279]"
    ]
    const corPerfil = coresPerfil[props.index % coresPerfil.length];

  return (
    <div className="flex min-h-[70px] w-full cursor-pointer justify-between rounded-[45px] bg-[#FFFDFA] sm:rounded-[80px]">
    <div className="flex min-w-0 items-center gap-2.5 px-3 sm:gap-4 sm:px-4">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[70%] sm:h-12 sm:w-12 ${corPerfil}`}>
            <p className="text-lg font-bold sm:text-xl">{pegainicial(props.nome)}</p>
        </div>
        <div className="flex flex-col gap-1.5">
            <div className="nome">
                <p className="font-bold text-sm sm:text-base">{props.nome}</p>
            </div>
            <div className="neuro">
                <TagNeuro label={props.Neuro}/>
            </div>
        </div>
    </div>
    <div className="flex items-start justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-5">
        <div className="flex items-center gap-2 sm:gap-5">
        <div className="turma">
        <p className="hidden text-right text-sm font-thin sm:block">{props.Turma}</p> </div>
        <div className="w-auto h-auto">
            <button className="cursor-pointer">
             <EllipsisVertical height={"25px"}/> 
             </button>
             </div>
        </div>
    </div>
    </div>
  );
}
