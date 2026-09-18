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
    <div className="flex min-h-[90px] w-full cursor-pointer justify-between rounded-[45px] bg-[#FFFDFA] sm:rounded-[80px]">
    <div className="flex min-w-0 items-center gap-3 px-4 sm:gap-5 sm:px-5">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[70%] sm:h-[60px] sm:w-[60px] ${corPerfil}`}>
            <p className="text-xl font-bold sm:text-2xl">{pegainicial(props.nome)}</p>
        </div>
        <div className="flex flex-col gap-2">
            <div className="nome">
                <p className="font-bold text-md">{props.nome}</p>
            </div>
            <div className="neuro">
                <TagNeuro label={props.Neuro}/>
            </div>
        </div>
    </div>
    <div className="flex items-start justify-between gap-2 px-4 py-5 sm:gap-5 sm:px-6">
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
