"use client"

import { useState, useRef, useEffect } from "react";
import TagNeuro  from "./TagNeuro";
import { EllipsisVertical } from 'lucide-react';
import { pegainicial } from '@/utils/pegariniciais'
import VerMais from "./BoxVerMais";

interface AlunoProps{
    nome: string
    Neuro: string
    Turma: string
    index: number
    onEditar?: () => void
    onExcluir?: () => void
}
export default function Aluno( props: AlunoProps) {
    const coresPerfil = [
        "bg-[#CEFFCA]", "bg-[#FF9999]", "bg-[#D4C7F8]", "bg-[#CAF3FF]", "bg-[#FFD279]"
    ]
    const corPerfil = coresPerfil[props.index % coresPerfil.length];

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
            <div
                className="relative w-auto h-auto"
                ref={menuRef}
                onClick={(event) => {
                    // Impede que o clique nos três pontos (ou no menu) dispare
                    // a navegação de um eventual Link que envolva o card do aluno.
                    event.preventDefault();
                    event.stopPropagation();
                }}
            >
                <button type="button" className="cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                    <EllipsisVertical height={"25px"}/> 
                </button>

                {isOpen && (
                    <div className="absolute right-0 top-full mt-2 z-20">
                        <VerMais onEditar={handleEditar} onExcluir={handleExcluir} />
                    </div>
                )}
                </div>
            </div>
        </div>
        </div>
    );
}