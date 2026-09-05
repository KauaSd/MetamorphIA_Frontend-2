import TagNeuro  from "./TagNeuro";
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
    <div className="flex w-[515px] h-[90px] bg-[#FFFDFA] rounded-[80px] justify-between cursor-pointer"> 
    <div className="flex justify-around items-center px-5 gap-5">
        <div className={`w-[60px] h-[60px] rounded-[70%] ${corPerfil} flex justify-center items-center`}>
            <p className="font-bold text-2xl">{pegainicial(props.nome)}</p>
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
    <div className="flex items-start justify-between px-12 py-6 gap-5">
        <div className="flex items-center gap-5">
        <div className="turma">
        <p className="text-sm font-thin">{props.Turma}</p> </div>
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