import Menu from "@/components/Menu";
import HeaderPag from "@/components/HeaderRecentes";
import Historico from "@/components/ConversasRecentes";

export default function Recentes(){
    const chats = [
        {aluno: "Julia Holanda", neuro: "TEA", data: "07/09/2026", turma: "3º Ano A - Manhã", chat: "Atividade de leitura"},
        {aluno: "Lucas Olioti", neuro: "TDAH", data: "16/08/2026", turma: "3º Ano A - Manhã", chat: "Adaptação visual de atividades pedagógicas"},
        {aluno: "Junior Marcos", neuro: "TDAH", data: "05/08/2026", turma: "3º Ano A - Manhã", chat: "Rotina visual: Técnicas de organização e ideias de painéis"},
    ]

    return(
        <div className="flex flex-row w-full min-h-screen">
            <Menu />
            <main className="flex justify-center w-full min-w-0">
                <div className="flex w-full max-w-[1056px] flex-col px-5 sm:px-8 lg:px-12">
                    <div className="flex flex-col w-full gap-5 mt-8 sm:mt-12 lg:mt-20">
                        <HeaderPag />
                    </div>
                    <div className="flex flex-col mt-6 sm:mt-10 gap-4 sm:gap-5 pb-8">
                        {chats.map((chat, index) => (
                            <Historico
                                key={index}
                                aluno={chat.aluno}
                                neuro={chat.neuro}
                                data={chat.data}
                                turma={chat.turma}
                                chat={chat.chat}
                            />
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}