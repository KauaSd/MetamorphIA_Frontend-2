import { ChevronRight, ChevronLeft } from "lucide-react"
import { useState } from "react"
import Button from "@/components/common/Button"
import DropDown from "@/components/common/DropDown"
import { PeiFlowProvider, usePeiFlow } from "@/components/app/state/PeiFlowProvider"
import GuidedQuestionsScreen from "@/components/app/pei/GuidedQuestionsScreen"
import ChatInput from "@/components/app/pei/ChatInput"
import { OPCOES_COMPONENTE, OPCOES_PERIODO } from "@/utils/pei/opcoes"
import type { Aluno } from "@/utils/data/types"

interface ConteudopeiProps {
    onFechar?: () => void
    onCriarAgora?: () => void
    mostrarCriacao?: boolean
    nomeAluno?: string | null
    professor?: string
    className?: string
    children?: React.ReactNode
    aluno?: Aluno | null
    onVoltar?: () => void
    onEnviarChat?: (texto: string) => void
    chatPlaceholder?: string
    chatDisabled?: boolean
}

export default function Conteudopei(props: ConteudopeiProps) {
    return (
        <PeiFlowProvider aluno={props.aluno ?? null}>
            <ConteudopeiConteudo {...props} />
        </PeiFlowProvider>
    )
}

function ConteudopeiConteudo({
    onFechar,
    onCriarAgora,
    mostrarCriacao = false,
    nomeAluno,
    professor,
    className,
    children,
    onVoltar,
    onEnviarChat,
    chatPlaceholder,
    chatDisabled,
}: ConteudopeiProps) {
    const {
        passo,
        componente,
        periodo,
        status,
        setComponente,
        setPeriodo,
        irParaQuestoes,
        fluxoEmAndamento,
        anexosAtuais,
        adicionarAnexos,
        removerAnexo,
        confirmarTexto,
    } = usePeiFlow()
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)
    const emQuestoes = passo === "questoes"

    function fechar() {
        if (fluxoEmAndamento) setMostrarConfirmacao(true)
        else onFechar?.()
    }

    return (
        <>
        <div className={`${className ?? ""} relative flex w-full h-full flex-col items-center gap-3 sm:gap-4 rounded-[70px] bg-surface-base/40 px-4 py-3 sm:px-8 sm:py-4 overflow-auto`}>
            <button
                type="button"
                aria-label="Fechar painel"
                onClick={fechar}
                className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted text-xl text-secondary cursor-pointer transition-colors hover:bg-surface-base-hover"
            >
                ×
            </button>

            {!emQuestoes && (
                <>
                <p className={`text-center text-3xl sm:text-4xl lg:text-5xl transition-all duration-500 ${mostrarCriacao ? "mt-8" : "mt-20"}`}>OK, vamos começar!</p>

                <div className={`flex w-full flex-col items-center gap-4 justify-center sm:flex-row sm:gap-40 transition-all duration-500 ${mostrarCriacao ? "mt-6" : "mt-30"}`}>
                    <Button className="w-full bg-[#FEDA7A] text-[#433F3F] hover:bg-[#FEDA7A]/80 sm:w-80 px-8 py-3 text-base sm:text-lg">
                        Importar PEI
                    </Button>
                    <Button
                        onClick={onCriarAgora}
                        className={`w-full sm:w-80 px-8 py-3 text-base sm:text-lg ${mostrarCriacao ? "opacity-50 cursor-not-allowed hover:bg-surface-accent" : ""}`}>Criar agora</Button>
                </div>
                </>
            )}

            {(mostrarCriacao || emQuestoes) && (
                <div className="flex w-full flex-1 flex-col items-center justify-center">
                <div className="flex w-full flex-col gap-3 rounded-[70px] bg-surface-muted/50 px-4 py-3 sm:px-6 sm:py-4 max-w-[64rem] animate-[painel-criar_600ms_cubic-bezier(0.16,1,0.3,1)]">
                    {emQuestoes ? (
                        <GuidedQuestionsScreen />
                    ) : (
                        <>
                        <div className="flex w-full items-center justify-between gap-2">
                            <h2 className="text-lg sm:text-xl lg:text-2xl">
                                Informações iniciais
                            </h2>
                            <div className="flex">
                            <button
                                type="button"
                                onClick={() => onVoltar?.()}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted text-xl text-secondary transition-colors hover:bg-surface-base-hover"
                                aria-label="Voltar"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                type="button"
                                onClick={() => irParaQuestoes()}
                                disabled={!componente || !periodo}
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted text-xl text-secondary transition-colors hover:bg-surface-base-hover disabled:cursor-not-allowed disabled:opacity-40"
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
                        </>
                    )}
                </div>
                </div>
            )}

            <div className="mt-auto flex w-full flex-col gap-4 justify-end">
                <div className="mx-auto flex w-full max-w-[64rem] flex-col gap-4">
                    <ChatInput
                        validarPrivacidade={emQuestoes}
                        placeholder={emQuestoes ? "Se preferir, digite a resposta abaixo" : chatPlaceholder}
                        enviarLabel={emQuestoes ? "Confirmar resposta" : "Enviar mensagem"}
                        disabled={emQuestoes ? status === "carregando" : chatDisabled}
                        anexos={emQuestoes ? anexosAtuais : undefined}
                        onAdicionarAnexos={emQuestoes ? adicionarAnexos : undefined}
                        onRemoverAnexo={emQuestoes ? removerAnexo : undefined}
                        onSubmit={(texto) => {
                            if (emQuestoes) confirmarTexto(texto)
                            else onEnviarChat?.(texto)
                        }}
                    />
                    {children}
                </div>
            </div>
        </div>

        {mostrarConfirmacao && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-inverse/50 px-4">
                <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-[70px] bg-surface-base px-6 py-8 text-center">
                    <p className="text-base text-primary sm:text-lg">
                        Seu progresso foi salvo. Deseja sair?
                    </p>
                    <div className="flex gap-3">
                        <Button onClick={() => setMostrarConfirmacao(false)} className="w-auto px-6">
                            Continuar
                        </Button>
                        <Button
                            onClick={() => {
                                setMostrarConfirmacao(false)
                                onFechar?.()
                            }}
                            className="w-auto px-6"
                        >
                            Sair
                        </Button>
                    </div>
                </div>
            </div>
        )}
        </>
    )
}