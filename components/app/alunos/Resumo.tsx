"use client";

import { useEffect, useRef, useState } from "react";
import Encaracolado from "@/components/common/Encaracolado";
import EncaracoladoSvg from "@/public/EncaracoladoResumo.svg";
import Lapis from "@/public/mode_edit.svg";

type TipoStat = 1 | 2;
interface ResumoProps{
    tipo: TipoStat;
    txt: string;
    onSave: (novoTexto: string) => void;
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
        setEditando(false);
    }

    function confirmarEdicao(){
        if (textoEditado.trim() === "") return;

        props.onSave(textoEditado);
        setEditando(false);
    }

    return(
        <div className="relative flex min-h-28 w-full flex-col gap-2 rounded-[35px] bg-surface-base px-8 py-4">
            <Encaracolado src={EncaracoladoSvg.src} className="absolute left-[-10] top-1/2 -translate-y-1/2 w-[30px] aspect-[33/141]" />
            <div className="flex flex-row justify-between">
                <p className="font-(family-name:--font-text-me-one) text-xl text-primary sm:text-2xl"> {config.titulo} </p>

                {editando ? (
                    <div className="flex flex-row items-center gap-2">
                        <button
                            type="button"
                            onClick={cancelarEdicao}
                            className="bg-[#D9D9D9] cursor-pointer rounded-[70px] py-1 px-3 hover:bg-sunken-hover">
                                Cancelar
                            </button>

                        <button
                            type="button"
                            onClick={confirmarEdicao}
                            disabled={textoEditado.trim() === ""}
                            className="bg-surface-accent cursor-pointer rounded-[70px] py-1 px-3 hover:bg-surface-accent-strong disabled:cursor-not-allowed disabled:opacity-50">
                            Salvar
                        </button>
                    </div>    
                ) : (
                    <button
                        type="button"
                        onClick={iniciarEdicao}
                        className="bg-[#D9D9D9] cursor-pointer rounded-[100%] p-1 hover:bg-sunken-hover">
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
                        className="min-h-28 w-full resize-y rounded-2xl border border-[#D9D9D9] bg-transparent p-2 font-(family-name:--font-poppins) text-secondary text-sm text-justify outline-none focus:border-primary"
                    />
                ) : (
                    <p className="font-(family-name:--font-poppins) text-secondary text-sm text-justify">{props.txt}</p>
                )}
            </div>
        </div>
    )
}
