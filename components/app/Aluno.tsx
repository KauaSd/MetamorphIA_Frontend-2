"use client"

import { useState, useRef, useEffect } from "react";
import TagNeuro  from "@/components/common/TagNeuro";
import { EllipsisVertical } from 'lucide-react';
import { pegainicial } from '@/utils/pegariniciais'
import VerMais from "@/components/common/VerMais";

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
        "bg-surface-success", "bg-surface-danger", "bg-surface-accent", "bg-surface-info", "bg-surface-warning"
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
        <div className="flex min-h-[70px] w-full cursor-pointer justify-between rounded-[45px] bg-surface-base sm:rounded-[80px]">
            <div className="flex min-w-0 items-center gap-2.5 px-3 sm:gap-4 sm:px-4">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[70%] text-ink sm:h-12 sm:w-12 ${corPerfil}`}>
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
                        <div className="relative w-auto h-auto" ref={menuRef} onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                        }}>
                            <button className="cursor-pointer" type="button" onClick={() => setIsOpen(!isOpen)}>
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