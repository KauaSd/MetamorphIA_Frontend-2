"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import Blurfundo from "@/components/common/Blurfundo";
import Button from "@/components/common/Button";
interface Tutprops{
    title:string
    text:string
}
export type VarianteTutorial = "padrao" | "institucional";

interface TutorialProps {
    tipo: tutId
    variante?: VarianteTutorial
    onClose?: () => void
}
export type tutId = "1" | "2" | "3" | "4" | "5" | "6";
const TUTORIAL_PADRAO: Record<tutId, Tutprops> = {
    1: {
    title: "Bem-vindo!",
    text: "É muito bom ter você por aqui! Criamos uma escola inicial para você, que pode ser renomeada quando quiser. Depois, é só criar turmas e adicionar seus alunos."
},
    2: {
    title: "Organize em turmas",
    text: "Para encontrar facilmente os alunos de uma mesma turma, reúna-os em um só lugar. Crie uma turma!"
},
    3: {
    title: "Adicione seus alunos",
    text: "Com a turma selecionada, adicione seu primeiro aluno! E então poderá visualizar o chat e as demais funcionalidades."
},
    4: {
    title: "Hora do PEI!",
    text: "Envie o PDF do PEI do aluno ou crie o plano de forma dinâmica no chat com a MetamorphIA. Atenção: o chat só libera as adaptações após essa etapa."
},
    5: {
    title: "Chat individual",
    text: "Cada aluno tem o seu próprio chat. Quanto mais você adapta atividades e nos atualiza, mais a IA conhece o estudante e mais precisa fica a ajuda."
},
    6: {
    title: "Vamos começar?",
    text: "Pronto para começar? Inicie uma turma e descubra uma adaptação mais fácil e mais horas livres no seu dia!"
}
}
const TUTORIAL_INSTITUCIONAL: Record<tutId, Tutprops> = {
    1: {
    title: "Plano institucional",
    text: "Você faz parte do plano Institucional! Com ele, tem muito mais adaptações por dia e outras funcionalidades."
},
    2: {
    title: "Prontinho pra você",
    text: "A(s) escola(s), turmas e alunos já foram organizados pela sua instituição!"
},
    3: {
    title: "Você pode editar...",
    text: "Dados simples, como nome, idade e necessidades do aluno."
},
    4: {
    title: "Hora do PEI!",
    text: "Envie o PDF do PEI do aluno ou crie o plano de forma dinâmica no chat com a MetamorphIA. Atenção: o chat só libera as adaptações após essa etapa."
},
    5: {
    title: "Chat individual",
    text: "Cada aluno tem o seu próprio chat. Quanto mais você adapta atividades e nos atualiza, mais a IA conhece o estudante e mais precisa fica a ajuda."
},
    6: {
    title: "Vamos começar?",
    text: "Pronto para começar? Acesse suas turmas e alunos. Descubra uma adaptação mais fácil e mais horas livres no seu dia!"
}
}
const proximo: Record<tutId, tutId> = {
    1: "2",
    2: "3",
    3: "4",
    4: "5",
    5: "6",
    6: "6",
}

export default function Tutorial( { tipo, variante = "padrao", onClose }: TutorialProps ) {
    const [passo, setPasso] = useState<tutId>(tipo)
   const router = useRouter()
   const ehInstitucional = variante === "institucional"
   const mapa = ehInstitucional ? TUTORIAL_INSTITUCIONAL : TUTORIAL_PADRAO
   const t = mapa[passo]

    const irParaTurmas = () => {
        onClose?.()
        router.push("/turmas")
    }
    const classeBotaoPrimario = ehInstitucional
        ? "bg-surface-warning hover:bg-surface-warning-strong text-ink"
        : ""
    const classeBotaoSecundario = ehInstitucional
        ? "bg-surface-base border border-surface-warning text-warning hover:bg-surface-warning hover:text-ink"
        : "bg-surface-base border border-surface-accent text-surface-accent hover:bg-surface-accent hover:text-ink"

    return(
        <Blurfundo>
        <div className="fixed inset-0 z-50 h-dvh w-screen sm:static sm:h-auto sm:w-full sm:max-w-md">
        <div className="flex h-full w-full flex-col gap-6 overflow-y-auto rounded-none bg-surface-base p-5 shadow-md sm:h-auto sm:gap-6 sm:rounded-[70px] sm:p-8">
            <div className="flex items-center justify-between">
            <p className="text-3xl text-primary sm:text-4xl font-(family-name:--font-text-me-one)">{t.title}</p>
            <button type="button" aria-label="Fechar" className="cursor-pointer" onClick={onClose}>
                <X className="w-6 h-6" />
            </button>
            </div>
            <p className="text-md text-primary text-justify">{t.text}</p>
            {passo === "6" ? (
                <div className="flex self-end">
                    <Button type="button" className={`w-auto px-6 ${classeBotaoPrimario}`} onClick={irParaTurmas}>
                        {ehInstitucional ? "Ver minhas turmas" : "Adicione uma turma"}
                    </Button>
                </div>
            ) : (
                <div className="flex w-60 gap-5 self-end">
                    <Button type="button" className={classeBotaoSecundario} onClick={() => setPasso("6")}>Pular</Button>
                    <Button type="button" className={classeBotaoPrimario} onClick={() => setPasso((atual) => proximo[atual])}>Próximo</Button>
                </div>
            )}
        </div>
        </div>
        </Blurfundo>
    )

 }