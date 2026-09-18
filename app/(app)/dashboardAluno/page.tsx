import Menu from "@/components/app/Menu";
import HeaderPag from "@/components/app/HeaderDashAl";
import Estatistica from "@/components/app/CardEstatisticaAluno";
import Resumo from "@/components/app/Resumo";
import Engajamento from "@/components/app/Engajamento";
import Recentes from "@/components/app/HistoricoTags";

export default function DashboardAluno(){

    const chats = [
        {chat: "Adaptação de atividade de leitura", data: "15/05/2026"},
        {chat: "Estratégia para concentração em sala", data: "15/05/2026"},
        {chat: "Avaliação adaptada de matemática", data: "08/05/2026"}
    ]

    return(
        <div className="flex min-h-screen w-full text-[#433F3F]">
            <Menu />
                <div className="mx-auto flex w-full max-w-[1056px] flex-col gap-6 px-5 py-8 sm:px-8 lg:px-12 lg:py-[70px]">
                    <div className="flex w-full flex-col">
                        <HeaderPag />
                    </div>
                    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <Estatistica tipo={1} valor={8} />
                        <Estatistica tipo={2} valor={74} />
                        <Estatistica tipo={3} valor={12} />
                    </div>
                    <Resumo tipo={2} txt="Lucas apresenta atenção fragmentada em tarefas longas, mas excelente desempenho em atividades curtas e gamificadas. Responde  bem a instruções visuais e recompensas imediatas. Sugere-se segmentar  atividades em blocos de no máximo 10 minutos." />
                    <Engajamento tipo={1} />
                    <div className="flex flex-col gap-3 pb-6">
                        <div className="flex flex-row items-start justify-between gap-1 sm:items-center">
                            <p className="font-(family-name:--font-text-me-one) text-2xl">Histórico de Conversas</p>
                            <p className="text-sm text-[#797979]">{chats.length} conversas</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            {chats.map((chat, index) => (
                                <Recentes
                                    key={index}
                                    chat={chat.chat}
                                    data={chat.data}
                                />
                            ))}
                        </div>
                    </div>
                </div>
        </div>
    )
}