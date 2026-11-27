import { ChevronRight, ChevronLeft, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Button from "@/components/common/Button"
import { OverlayCarregando } from "@/components/common/Carregando"
import DropDown from "@/components/common/DropDown"
import { PeiFlowProvider, usePeiFlow } from "@/components/app/state/PeiFlowProvider"
import { useData } from "@/components/app/state/DataProvider"
import GuidedQuestionsScreen from "@/components/app/pei/GuidedQuestionsScreen"
import InfoNotice from "@/components/app/pei/InfoNotice"
import ChatInput from "@/components/app/pei/ChatInput"
import Icon from "@/public/icon.png"
import { OPCOES_PERIODO, componenteLabel, obterOpcoesComponente } from "@/utils/pei/opcoes"
import { getSavedUserProfile } from "@/utils/apiClient"
import { letraDaOpcao } from "@/utils/pei/types"
import { peiService } from "@/utils/pei/service"
import type { Aluno, AnexoMensagem } from "@/utils/data/types"

interface ConteudopeiProps {
    onFechar?: () => void
    onCriarAgora?: () => void
    onConcluirPei?: (
        mensagem: string,
        anexos?: AnexoMensagem[],
        opcoes?: { aguardarDocumento?: boolean; tituloConversa?: string },
    ) => void
    mostrarCriacao?: boolean
    nomeAluno?: string | null
    professor?: string
    className?: string
    children?: React.ReactNode
    aluno?: Aluno | null
    onVoltar?: () => void
    onEnviarChat?: (texto: string, anexos?: AnexoMensagem[]) => void
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
    onConcluirPei,
    mostrarCriacao = false,
    aluno,
    nomeAluno,
    professor,
    className,
    children,
    onVoltar,
    onEnviarChat,
    chatPlaceholder,
}: ConteudopeiProps) {
    const {
        passo,
        componente,
        periodo,
        status,
        questions,
        respostas,
        respostaAtual,
        mostrarRevisao,
        setMostrarRevisao,
        setComponente,
        setPeriodo,
        irParaQuestoes,
        enviarConhecimentoAluno,
        avancar,
        fluxoEmAndamento,
        anexosAtuais,
        adicionarAnexos,
        removerAnexo,
        confirmarTexto,
        limpar,
    } = usePeiFlow()

    const { turmas } = useData()
    const perfilSalvo = getSavedUserProfile()
    const turmaDoAluno = aluno?.turmaId
        ? turmas.find((t) => t.id === aluno.turmaId)
        : undefined
    const disciplinasDaTurma =
        turmaDoAluno?.disciplinas && turmaDoAluno.disciplinas.length > 0
            ? turmaDoAluno.disciplinas
            : perfilSalvo?.tags?.length
              ? perfilSalvo.tags
              : perfilSalvo?.tags_areas
    const opcoesComponente = obterOpcoesComponente(disciplinasDaTurma)
    const componenteValido = opcoesComponente.some((o) => o.value === componente)
        ? componente
        : (opcoesComponente[0]?.value ?? "")

    useEffect(() => {
        if (componenteValido && componente !== componenteValido) {
            setComponente(componenteValido)
        }
    }, [componenteValido, componente, setComponente])
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)
    const [gerandoPei, setGerandoPei] = useState(false)
    const [acaoPei, setAcaoPei] = useState<"importando" | "gerando" | null>(null)
    const importarInputRef = useRef<HTMLInputElement>(null)
    const emQuestoes = passo === "questoes"
    const emConhecer = passo === "conhecer"

    function fechar() {
        if (gerandoPei) return
        if (fluxoEmAndamento) setMostrarConfirmacao(true)
        else onFechar?.()
    }

    async function handleImportarArquivo(files: FileList | null) {
        if (!files || files.length === 0 || !aluno || gerandoPei) return
        const arquivo = files[0]
        setGerandoPei(true)
        setAcaoPei("importando")
        try {
            const resultado = await peiService.importarPeiArquivo({
                aluno,
                arquivo,
                componente,
                periodo,
            })
            const pendentes = resultado.disciplinasPendentes ?? []
            const avisoPendentes =
                resultado.todosPeisConcluidos === false && pendentes.length > 0
                    ? `\n\n⚠️ Para liberar o chat deste aluno, ainda falta concluir o PEI de: **${pendentes.join(", ")}**.`
                    : ""
            const nomeComp = componenteLabel(componente) || componente
            const mensagem = `O PEI de **${aluno.nome}** (${nomeComp}) foi importado com sucesso a partir do arquivo **${arquivo.name}**! 🎉\n\nO contexto pedagógico do estudante já foi atualizado no banco vetorial da IA e o documento está anexado abaixo.${avisoPendentes}`
            limpar()
            onConcluirPei?.(mensagem, resultado.anexo ? [resultado.anexo] : undefined, {
                tituloConversa: `PEI - ${nomeComp}`,
            })
        } finally {
            setGerandoPei(false)
            setAcaoPei(null)
            if (importarInputRef.current) importarInputRef.current.value = ""
        }
    }

    async function confirmarPei() {
        if (gerandoPei) return
        setGerandoPei(true)
        setAcaoPei("gerando")
        try {
            const linhas = questions.map((pergunta, idx) => {
                const resp = respostas[pergunta.id]
                const escolhidas = pergunta.options
                    .map((op, opIdx) =>
                        resp?.selectedOptionIds.includes(op.id)
                            ? `${letraDaOpcao(opIdx)}. ${op.text}`
                            : null,
                    )
                    .filter(Boolean)
                const textoLivre = resp?.freeText?.trim()
                const itens = [
                    ...escolhidas.map((opcao) => `- **Resposta:** ${opcao}`),
                    ...(textoLivre ? [`- **Complemento:** ${textoLivre}`] : []),
                ]
                const corpoResposta =
                    itens.length > 0 ? itens.join("\n") : "- *Sem resposta*"
                return `**${idx + 1}. ${pergunta.text}**\n\n${corpoResposta}`
            })

            let anexosGerados: AnexoMensagem[] | undefined
            let respostasGeraisDoc: Record<string, string> | undefined
            let todosConcluidos: boolean | undefined
            let pendentes: string[] = []
            if (aluno) {
                const gerado = await peiService.gerarPeiDocumento({
                    aluno,
                    professor,
                    componente,
                    periodo,
                    questions,
                    respostas,
                })
                if (gerado?.anexo) {
                    anexosGerados = [gerado.anexo]
                }
                respostasGeraisDoc = gerado?.respostasGerais
                todosConcluidos = gerado?.todosPeisConcluidos
                pendentes = gerado?.disciplinasPendentes ?? []
            }

            const blocoDocumento = respostasGeraisDoc && Object.keys(respostasGeraisDoc).length > 0
                ? `\n\n---\n\n**Texto consolidado que irá para o documento do PEI:**\n\n${Object.entries(respostasGeraisDoc)
                      .map(([pergunta, texto]) => `**${pergunta}**\n${texto}`)
                      .join("\n\n")}`
                : ""

            const avisoPendentes =
                todosConcluidos === false && pendentes.length > 0
                    ? `\n\n⚠️ **Falta concluir outros PEIs antes de liberar o chat de adaptação de atividades:** ${pendentes.join(", ")}. Enquanto isso, você pode usar este chat apenas para ajustar as respostas deste PEI ou digitar **"Documento"** para baixar o **.docx**.`
                    : ""

            const nomeComp = componenteLabel(componente) || componente
            const mensagem = anexosGerados?.length
                ? `A criação do PEI de **${nomeComp}** foi um sucesso! 🎉\nAbaixo estão as suas respostas e o texto que irá para o documento. Se quiser trocar ou ajustar alguma resposta, é só me pedir aqui no chat!\n\n---\n\n${linhas.join("\n\n")}${blocoDocumento}\n\n---\n\nQuando estiver tudo certo e quiser baixar o arquivo **.docx**, basta digitar **"Documento"**!${avisoPendentes}`
                : `Registrei as respostas do PEI abaixo, mas não foi possível gerar o arquivo **.docx** no servidor agora (verifique se sua sessão ainda está ativa ou faça login novamente).\n\n---\n\n${linhas.join("\n\n")}`

            setMostrarRevisao(false)
            limpar()
            onConcluirPei?.(mensagem, anexosGerados, {
                aguardarDocumento: Boolean(anexosGerados?.length),
                tituloConversa: `PEI - ${nomeComp}`,
            })
        } finally {
            setGerandoPei(false)
            setAcaoPei(null)
        }
    }

    return (
        <>
        <div className={`${className ?? ""} relative flex w-full h-full flex-col items-center gap-3 sm:gap-4 rounded-[70px] bg-surface-base/40 px-4 py-3 sm:px-8 sm:py-4 overflow-auto`}>
            <OverlayCarregando
                ativo={gerandoPei && acaoPei === "importando"}
                mensagem="Importando PEI..."
            />
            <button
                type="button"
                aria-label="Fechar painel"
                onClick={fechar}
                className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full text-xl text-primary cursor-pointer transition-colors hover:bg-sunken/60"
            >
                ×
            </button>

            {!emQuestoes && !emConhecer && (
                <>
                <p className={`text-center text-3xl sm:text-4xl lg:text-5xl transition-all duration-500 ${mostrarCriacao ? "mt-8" : "mt-20"}`}>OK, vamos começar!</p>

                <div className={`flex w-full flex-col items-center gap-4 justify-center sm:flex-row sm:gap-40 transition-all duration-500 ${mostrarCriacao ? "mt-6" : "mt-30"}`}>
                    <input
                        ref={importarInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx,.txt"
                        className="hidden"
                        onChange={(e) => void handleImportarArquivo(e.target.files)}
                    />
                    <Button
                        type="button"
                        disabled={gerandoPei}
                        onClick={() => importarInputRef.current?.click()}
                        className="w-full bg-surface-warning text-ink hover:bg-warning sm:w-80 px-8 py-3 text-base sm:text-lg"
                    >
                        {gerandoPei ? "Importando..." : "Importar PEI"}
                    </Button>
                    <Button
                        onClick={onCriarAgora}
                        className={`w-full sm:w-80 px-8 py-3 text-base sm:text-lg ${mostrarCriacao ? "opacity-50 cursor-not-allowed hover:bg-surface-accent" : ""}`}>Criar agora</Button>
                </div>
                </>
            )}

            {emConhecer ? (
                <div className="flex w-full flex-1 flex-col items-center justify-center py-2">
                    <div className="mx-auto flex w-full max-w-[66rem] flex-col gap-4">
                        <InfoNotice componente={componente} />
                        <div className="flex w-full flex-col gap-4 rounded-[36px] bg-surface-base px-6 py-5 animate-[painel-criar_600ms_cubic-bezier(0.16,1,0.3,1)] sm:rounded-[48px] sm:px-9 sm:py-6">
                            <div className="flex items-center gap-4">
                                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-surface-inverse p-2 sm:h-13 sm:w-13">
                                    <img src={Icon.src} alt="" className="h-full w-full object-contain" />
                                </div>
                                <p className="text-base font-bold text-primary sm:text-lg">
                                    Primeira vez por aqui? Vamos conhecer seu aluno!
                                </p>
                            </div>
                            <p className="text-sm text-primary sm:text-[15px]">
                                Para começar, conte-nos como ele é em sala de aula. Quais são as maiores
                                dificuldades? E os pontos fortes e interesses? O que o engaja e o que não funciona?
                            </p>
                            <div className="pt-1">
                                <ChatInput
                                    validarPrivacidade
                                    multiline
                                    placeholder="Digite sua resposta aqui"
                                    enviarLabel="Enviar resposta"
                                    disabled={status === "salvando"}
                                    limparAoEnviar
                                    className="bg-surface-muted"
                                    onSubmit={(texto) => {
                                        if (texto.trim()) {
                                            void enviarConhecimentoAluno(texto)
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : emQuestoes ? (
                <div className="flex w-full flex-1 flex-col items-center justify-center py-2">
                    <GuidedQuestionsScreen
                        chatInput={
                            <ChatInput
                                validarPrivacidade
                                placeholder="Se preferir, digite a resposta abaixo"
                                enviarLabel="Confirmar resposta"
                                disabled={status === "carregando"}
                                value={respostaAtual.freeText ?? ""}
                                limparAoEnviar={false}
                                className="bg-surface-muted"
                                onChangeTexto={confirmarTexto}
                                anexos={anexosAtuais}
                                onAdicionarAnexos={adicionarAnexos}
                                onRemoverAnexo={removerAnexo}
                                onSubmit={(texto) => {
                                    confirmarTexto(texto)
                                    void avancar()
                                }}
                            />
                        }
                    />
                </div>
            ) : mostrarCriacao ? (
                <div className="flex w-full flex-1 flex-col items-center justify-center">
                <div className="flex w-full flex-col gap-3 rounded-[70px] bg-surface-muted/50 px-4 py-3 sm:px-6 sm:py-4 max-w-[64rem] animate-[painel-criar_600ms_cubic-bezier(0.16,1,0.3,1)]">
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
                                        options={opcoesComponente}
                                        value={componenteValido}
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
            ) : null}

            {((!emQuestoes && !emConhecer) || children) && (
                <div className="mt-auto flex w-full flex-col gap-4 justify-end">
                    <div className="mx-auto flex w-full max-w-[64rem] flex-col gap-4">
                        {!emQuestoes && !emConhecer && (
                            <ChatInput
                                placeholder={chatPlaceholder}
                                enviarLabel="Enviar mensagem"
                                disabled
                                limparAoEnviar
                                onSubmit={(texto, anexosSub) => {
                                    onEnviarChat?.(texto, anexosSub)
                                }}
                            />
                        )}
                        {children}
                    </div>
                </div>
            )}

        </div>

        {mostrarRevisao && (
            <div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-inverse/50 px-4"
                onClick={(e) => {
                    if (!gerandoPei && e.target === e.currentTarget) setMostrarRevisao(false)
                }}
            >
                <div className="w-full max-w-md">
                    <div className="relative overflow-hidden flex w-full flex-col gap-6 rounded-[40px] bg-surface-base p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
                        <OverlayCarregando ativo={gerandoPei} mensagem="Gerando PEI..." />
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <p className="text-3xl text-primary sm:text-4xl font-(family-name:--font-text-me-one)">
                                    Revisar respostas
                                </p>
                                <button
                                    type="button"
                                    aria-label="Fechar"
                                    disabled={gerandoPei}
                                    className="cursor-pointer hover:text-secondary disabled:opacity-50"
                                    onClick={() => setMostrarRevisao(false)}
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="flex flex-col gap-3">
                                <p className="text-md text-primary text-justify">
                                    Tem certeza de que essas são as respostas corretas e que todas foram revisadas?
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-5 self-end">
                            <Button
                                type="button"
                                disabled={gerandoPei}
                                onClick={() => setMostrarRevisao(false)}
                                className="bg-surface-inverse text-inverse hover:bg-surface-inverse-hover w-32"
                            >
                                Não
                            </Button>
                            <Button
                                type="button"
                                disabled={gerandoPei}
                                onClick={confirmarPei}
                                className="w-32"
                            >
                                Sim
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        )}

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
