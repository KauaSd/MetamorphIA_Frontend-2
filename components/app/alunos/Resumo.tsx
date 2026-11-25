"use client";

import { useEffect, useRef, useState } from "react";
import Encaracolado from "@/components/common/Encaracolado";
import { OverlayCarregando } from "@/components/common/Carregando";
import EncaracoladoSvg from "@/public/EncaracoladoResumo.svg";
import Lapis from "@/public/mode_edit.svg";

type TipoStat = 1 | 2;
interface ResumoProps{
    tipo: TipoStat;
    txt: string;
    onSave: (novoTexto: string) => void | Promise<void>;
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

    const [editando, setEditando] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [textoEditado, setTextoEditado] = useState("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (editando && textareaRef.current){
            const elemento = textareaRef.current;
            elemento.focus();
            elemento.setSelectionRange(elemento.value.length, elemento.value.length);
        }
    }, [editando]);

    function iniciarEdicao(){
        setTextoEditado(props.txt);
        setEditando(true);
    }

    function cancelarEdicao(){
        if (salvando) return;
        setEditando(false);
    }

    async function confirmarEdicao(){
        if (salvando || textoEditado.trim() === "") return;

        setSalvando(true);
        try {
            await props.onSave(textoEditado);
            setEditando(false);
        } finally {
            setSalvando(false);
        }
    }

    return(
        <div className={`relative flex min-h-28 w-full flex-col gap-2 bg-surface-base px-8 py-4 ${props.tipo === 2 ? "rounded-[50px]" : "rounded-[35px]"}`}>
            <OverlayCarregando ativo={salvando} mensagem="Salvando resumo..." />
            <Encaracolado src={EncaracoladoSvg.src} className="absolute left-[-10] top-1/2 -translate-y-1/2 w-[30px] aspect-[33/141]" />
            <div className="flex flex-row justify-between">
                <div className="flex items-center gap-2">
                    <p className="font-(family-name:--font-text-me-one) text-xl text-primary sm:text-2xl"> {config.titulo} </p>
                    {props.tipo === 2 ? (
                        <span className="text-base text-primary" aria-hidden="true">✦</span>
                    ) : null}
                </div>

                {editando ? (
                    <div className="flex flex-row items-center gap-2">
                        <button
                            type="button"
                            onClick={cancelarEdicao}
                            disabled={salvando}
                            className="bg-sunken cursor-pointer rounded-[70px] py-1 px-3 hover:bg-sunken-hover disabled:cursor-not-allowed disabled:opacity-50">
                                Cancelar
                            </button>

                        <button
                            type="button"
                            onClick={() => void confirmarEdicao()}
                            disabled={salvando || textoEditado.trim() === ""}
                            className="bg-surface-accent cursor-pointer rounded-[70px] py-1 px-3 hover:bg-surface-accent-strong disabled:cursor-not-allowed disabled:opacity-50">
                            Salvar
                        </button>
                    </div>    
                ) : (
                    <button
                        type="button"
                        onClick={iniciarEdicao}
                        className="bg-sunken cursor-pointer rounded-[100%] p-1 hover:bg-sunken-hover">
                        <img src={Lapis.src} aria-hidden="true" />
                    </button>
                )}
            </div>
            <div>
                {editando ? (
                    <textarea
                        ref={textareaRef}
                        value={textoEditado}
                        onChange={(e) => setTextoEditado(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") cancelarEdicao();
                        }}
                        rows={5}
                        className="min-h-28 w-full resize-y rounded-2xl border border-sunken bg-transparent p-2 font-(family-name:--font-poppins) text-secondary text-sm text-justify outline-none focus:border-primary"
                    />
                ) : (
                    <p className="font-(family-name:--font-poppins) text-secondary text-sm text-justify">{props.txt}</p>
                )}
            </div>
        </div>
    )
}
