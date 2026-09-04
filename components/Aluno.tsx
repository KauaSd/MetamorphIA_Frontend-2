import TagNeuro  from "./TagNeuro";
import { EllipsisVertical } from 'lucide-react';
import { pegainicial } from '@/utils/pegariniciais'
interface AlunoProps{
    nome: string
    Neuro: string
    Turma: string
}
export default function Aluno( props: AlunoProps) {


  return (
    <div className="flex w-180 h-27 bg-[#FFFDFA] rounded-[80px] justify-between"> 
    <div className="flex justify-around items-center px-5 gap-5">
        <div className="w-21.5 h-21.5 rounded-[70%] bg-blue-300 flex justify-center items-center">
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