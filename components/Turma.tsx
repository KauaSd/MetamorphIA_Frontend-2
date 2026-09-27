"use client"

import { useState, useRef, useEffect } from "react";
import TagAluno from "@/components/TagAluno"
import { EllipsisVertical } from 'lucide-react';
import Encaracolado from "@/public/EncaracoladoTurma.svg";
import VerMais from "./BoxVerMais";

export interface Aluno{
    id?: string | number
    nome: string
    neuro: string
}
interface TurmaProps{
    nomeTurma:string
    alunos: Aluno[]
    onEditar?: () => void
    onExcluir?: () => void
}

export default function Turma( props: TurmaProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function clicarFora(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", clicarFora);

        return () => {
            document.removeEventListener("mousedown", clicarFora);
        };
    }, []);

    function handleEditar(){
        setIsOpen(false);
        props.onEditar?.();
    }

    function handleExcluir(){
        setIsOpen(false);
        props.onExcluir?.();
    }

    return(
        <div className="relative flex flex-col w-[480px] h-38.5 bg-[#FFFDFA] rounded-[80px] px-12 py-6 gap-5">
            <img src={Encaracolado.src} className="absolute left-[-10px] top-1/2 -translate-y-1/2" />

            <div className="flex justify-between items-center cursor-pointer">
                <div className="nome">
                    <p className={`text-[28px] font-(family-name:--font-text-me-one)`}>{props.nomeTurma}</p>
                </div>
                <div
                    className="relative"
                    ref={menuRef}
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                    }}
                >
                    <button type="button"
                            className="cursor-pointer" 
                            onClick={() => setIsOpen(!isOpen)}
                    >
                        <EllipsisVertical height={"25px"}/> 
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 top-full mt-2 z-20">
                            <VerMais onEditar={handleEditar}
                                    onExcluir={handleExcluir}
                            />
                        </div>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-[auto_auto] justify-start gap-x-3 gap-y-0.5">
            {props.alunos.map((aluno, index) =>(
                <TagAluno
                    key={aluno.id || index}
                    nome={aluno.nome}
                    label={aluno.neuro}
                />
            ))}
            </div>
        </div>
    )
}