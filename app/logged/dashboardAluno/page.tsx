import Menu from "@/components/Menu";
import HeaderPag from "@/components/HeaderDashAl";
import Estatistica from "@/components/CardEstatisticaAluno";
import Resumo from "@/components/Resumo";
import Engajamento from "@/components/Engajamento";

export default function DashboardAluno(){
    return(
        <div className="flex min-h-screen w-full text-[#433F3F]">
            <Menu />
        
            <main className="min-w-0 flex-1 overflow-y-auto pl-16 md:pl-0">
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
                    <div className="flex flex-col gap-4 pb-8">
                        <div className="flex flex-col items-start justify-between gap-1 sm:flex-row sm:items-center">
                            <p className="font-(family-name:--font-text-me-one) text-2xl sm:text-3xl">Histórico de Conversas</p>
                            <p className="text-sm text-[#797979]">5 conversas</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
