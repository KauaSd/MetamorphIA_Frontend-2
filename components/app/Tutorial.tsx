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
interface TutorialProps {
    tipo: tutId
    onClose?: () => void
}
export type tutId = "1" | "2" | "3" | "4" | "5";
const tutorial : Record<tutId,Tutprops> = {
    1: {
    title: "Adicione seus alunos",
    text: "É muito bom ter você por aqui! Para acessar o chat e as demais funcionalidades, adicione um aluno."
},
    2: {
    title: "Organize em turmas",
    text: "Para encontrar facilmente os alunos de uma mesma turma, reúna-os em um só lugar. Crie uma turma!"
},
    3: {
    title: "Hora do PEI!",
    text: "Envie o PDF do PEI do aluno ou crie o plano de forma dinâmica no chat com a MetamorphIA. Atenção: o chat só libera as adaptações após essa etapa."
},
    4: {
    title: "Chat individual",
    text: "Cada aluno tem o seu próprio chat. Quanto mais você adapta atividades e nos atualiza, mais a IA conhece o estudante e mais precisa fica a ajuda."
},
    5: {
    title: "Vamos começar?",
    text: "Pronto para começar? Cadastre seu primeiro aluno e descubra uma adaptação mais fácil e mais horas livres no seu dia!"
}
}
const proximo: Record<tutId, tutId> = {
    1: "2",
    2: "3",
    3: "4",
    4: "5",
    5: "5",
}

export default function Tutorial( { tipo, onClose }: TutorialProps ) {
    const [passo, setPasso] = useState<tutId>(tipo)
   const router = useRouter()
   const t = tutorial[passo]

    // "vamos comecar" encerra o tutorial e leva para o cadastro de aluno, nunca para o chat
    const irParaAlunos = () => {
        onClose?.()
        router.push("/alunos")
    }
    return(
        <Blurfundo>
        <div className="w-full max-w-md">
        <div className="flex w-full flex-col gap-6 rounded-[40px] bg-surface-base p-5 shadow-md sm:gap-6 sm:rounded-[70px] sm:p-8">
            <div className="flex items-center justify-between">
            <p className="text-3xl text-primary sm:text-4xl font-(family-name:--font-text-me-one)">{t.title}</p>
            <button type="button" aria-label="Fechar" className="cursor-pointer" onClick={onClose}>
                <X className="w-6 h-6" />
            </button>
            </div>
            <p className="text-md text-primary text-justify">{t.text}</p>
            {passo === "5" ? (
                <div className="flex self-end">
                    <Button type="button" className="w-auto px-6" onClick={irParaAlunos}>Vamos começar</Button>
                </div>
            ) : (
                <div className="flex w-60 gap-5 self-end">
                    <Button type="button" className="bg-surface-base border border-surface-accent text-surface-accent hover:bg-surface-accent hover:text-ink" onClick={() => setPasso("5")}>Pular</Button>
                    <Button type="button" onClick={() => setPasso(proximo[passo])}>Próximo</Button>
                </div>
            )}
        </div>
        </div>
        </Blurfundo>
    )

 }