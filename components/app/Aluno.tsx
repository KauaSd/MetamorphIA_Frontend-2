"use client"

import { useState, useRef, useEffect } from "react";
import TagNeuro  from "@/components/common/TagNeuro";
import { EllipsisVertical } from 'lucide-react';
import { pegainicial } from '@/utils/pegariniciais'
import { corDoNome } from '@/utils/cores'
import VerMais from "@/components/common/VerMais";
import Link from "next/link";

interface AlunoProps{
    nome: string
    /** todas as neurodivergencias: cada uma vira uma pílula no card */
    neuros: string[]
    Turma: string
    href?: string
    onEditar?: () => void
    onExcluir?: () => void
}
export default function Aluno( props: AlunoProps) {
    const corAvatar = corDoNome(props.nome);

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

        function fecharComEsc(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", clicarFora);
        document.addEventListener("keydown", fecharComEsc);

        return () => {
            document.removeEventListener("mousedown", clicarFora);
            document.removeEventListener("keydown", fecharComEsc);
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

    // a area clicavel e o link; o botao de tres pontinhos fica fora dele para
    // nao aninhar um botao dentro de uma ancora
    const conteudo = (
        <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-3 sm:gap-5">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[70%] text-ink sm:h-14 sm:w-14 ${corAvatar}`}>
                    <p className="text-xl font-bold sm:text-2xl">{pegainicial(props.nome)}</p>
                </div>
                <div className="flex min-w-0 flex-col gap-2">
                    <p className="truncate font-bold text-base sm:text-lg">{props.nome}</p>
                    {props.neuros.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {props.neuros.map((rotulo) => (
                                <TagNeuro key={rotulo} label={rotulo} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <p className="hidden shrink-0 text-right text-base font-thin sm:block">{props.Turma}</p>
        </div>
    );

    return (
        <div className="relative flex min-h-[84px] w-full items-center rounded-[50px] bg-surface-base pr-12 sm:rounded-[90px] sm:pr-16">
            {props.href ? (
                <Link
                    href={props.href}
                    className="flex min-w-0 flex-1 items-center py-3.5 pl-4 sm:pl-5"
                >
                    {conteudo}
                </Link>
            ) : (
                <div className="flex min-w-0 flex-1 items-center py-3.5 pl-4 sm:pl-5">
                    {conteudo}
                </div>
            )}

            <div
                className="absolute right-4 top-1/2 -translate-y-1/2 sm:right-6"
                ref={menuRef}
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    aria-label={`Opcoes de ${props.nome}`}
                    aria-haspopup="menu"
                    aria-expanded={isOpen}
                    className="cursor-pointer"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <EllipsisVertical height={"28px"}/>
                </button>

                {isOpen && (
                    <div className="absolute right-0 top-full mt-2 z-20">
                        <VerMais onEditar={handleEditar} onExcluir={handleExcluir} />
                    </div>
                )}
            </div>
        </div>
            );
}