import { ChevronRight, ChevronLeft } from "lucide-react"
import { useState } from "react"
import Button from "@/components/common/Button"
import DropDown from "@/components/common/DropDown"

interface ConteudopeiProps {
    onFechar?: () => void
    onCriarAgora?: () => void
    mostrarCriacao?: boolean
    nomeAluno?: string | null
    professor?: string
    className?: string
    children?: React.ReactNode
}

const OPCOES_COMPONENTE = [
    { value: "artes", label: "Artes" },
    { value: "matematica", label: "Matemática" },
    { value: "portugues", label: "Português" },
    { value: "ciencias", label: "Ciências" },
]

const OPCOES_PERIODO = [
    { value: "1", label: "1º Bimestre" },
    { value: "2", label: "2º Bimestre" },
    { value: "3", label: "3º Bimestre" },
    { value: "4", label: "4º Bimestre" },
]

export default function Conteudopei({
    onFechar,
    onCriarAgora,
    mostrarCriacao = false,
    nomeAluno,
    professor,
    className,
    children,
}: ConteudopeiProps) {
    const [componente, setComponente] = useState("")
    const [periodo, setPeriodo] = useState("")

    return (
        <div className={`${className ?? ""} relative flex w-full h-full flex-col items-center gap-6 sm:gap-8 rounded-[70px] bg-surface-base/40 px-4 py-4 sm:px-8 sm:py-6 overflow-auto`}>
            <button
                type="button"
                aria-label="Fechar painel"
                onClick={() => onFechar?.()}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted text-xl text-secondary cursor-pointer transition-colors hover:bg-surface-base-hover"
            >
                ×
            </button>

            <p className={`text-center text-3xl sm:text-4xl lg:text-5xl transition-all duration-500 ${mostrarCriacao ? "mt-8" : "mt-20"}`}>OK, vamos começar!</p>

            <div className={`flex w-full flex-col items-center gap-4 justify-center sm:flex-row sm:gap-40 transition-all duration-500 ${mostrarCriacao ? "mt-6" : "mt-30"}`}>
                <Button className="w-full bg-[#FEDA7A] text-[#433F3F] hover:bg-[#FEDA7A]/80 sm:w-80 px-8 py-3 text-base sm:text-lg">
                    Importar PEI
                </Button>
                <Button 
                    onClick={onCriarAgora}
                    className={`w-full sm:w-80 px-8 py-3 text-base sm:text-lg ${mostrarCriacao ? "opacity-50 cursor-not-allowed hover:bg-surface-accent" : ""}`}>Criar agora</Button>
            </div>

            {mostrarCriacao && (
                <div className="flex w-full flex-1 flex-col items-center justify-center">
                <div className="flex w-full flex-col gap-4 rounded-[70px] bg-surface-muted/50 px-4 py-4 sm:px-6 sm:py-6 max-w-[64rem] animate-[painel-criar_600ms_cubic-bezier(0.16,1,0.3,1)]">
                    <div className="flex w-full items-center justify-between gap-2">
                        <h2 className="text-lg sm:text-xl lg:text-2xl">
                            Informações iniciais
                        </h2>
                        <div className="flex">
                        <button
                            type="button"
                            disabled
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted text-xl text-secondary transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                            aria-label="Voltar"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            type="button"
                            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted text-xl text-secondary transition-colors hover:bg-surface-base-hover"
                            aria-label="Avancar"
                        >
                            <ChevronRight size={20} />
                        </button></div>
                    </div>
                    <div className="flex flex-col gap-3">


                        <div className="flex flex-col gap-2 text-sm sm:text-base">
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium text-secondary sm:text-base">
                                    Nome do Estudante: {nomeAluno ?? ""}
                                </p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium text-secondary sm:text-base">
                                    Nome do Professor Regente: {professor ?? ""}
                                </p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium text-secondary sm:text-base">
                                    Nome do Professor Especializado da Educação Especial: (se houver)
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                <p className="text-sm font-medium text-secondary sm:text-base">
                                    Componente curricular
                                </p>
                                <DropDown
                                    options={OPCOES_COMPONENTE}
                                    value={componente}
                                    onChange={setComponente}
                                    small
                                    placeholder="Selecione o componente curricular"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <p className="text-sm font-medium text-secondary sm:text-base">
                                    Período
                                </p>
                                <DropDown
                                    options={OPCOES_PERIODO}
                                    small
                                    value={periodo}
                                    onChange={setPeriodo}
                                    placeholder="Selecione o bimestre"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            )}

            <div className="mt-auto flex w-full flex-col gap-4 justify-end">
            {children && (
                <div className="flex w-full flex-col gap-4 justify-end mx-auto max-w-[64rem]">
                    {children}
                </div>
            )}
            </div>
        </div>
    )
}
