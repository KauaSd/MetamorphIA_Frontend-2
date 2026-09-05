import TagAluno from "@/components/TagAluno"
import { EllipsisVertical } from 'lucide-react';
import Encaracolado from "@/public/EncaracoladoTurma.svg";

export interface Aluno{
    id?: string | number
    nome: string
    neuro: string
}
interface TurmaProps{
    nomeTurma:string
    alunos: Aluno[]
}

export default function Turma( props: TurmaProps) {
    return(
        <div className="relative flex flex-col w-[480px] h-38.5 bg-[#FFFDFA] rounded-[80px] px-12 py-6 gap-5">
            <img src={Encaracolado.src} className="absolute left-[-10px] top-1/2 -translate-y-1/2" />

            <div className="flex justify-between items-center cursor-pointer">
                <div className="nome">
                    <p className={`text-[28px] font-(family-name:--font-text-me-one)`}>{props.nomeTurma}</p>
                </div>
                <div className="3 pontos">
                <button className="cursor-pointer">
                <EllipsisVertical height={"25px"}/> 
             </button></div>
            </div>
            <div className="grid grid-cols-[auto_auto] justify-start gap-x-3 gap-y-0.5">
            {props.alunos.map((aluno, index) =>(
                <TagAluno
                key={aluno.id || index}
                nome={aluno.nome}
                label={aluno.neuro}/>
            ))}
            </div>
        </div>
    )
}
