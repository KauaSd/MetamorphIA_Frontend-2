import Menu from "@/components/Menu";
import HeaderPag from "@/components/HeaderDashAl";
import Estatistica from "@/components/CardEstatisticaAluno";
import Resumo from "@/components/Resumo";
import Button from "@/components/Button";
import Engajamento from "@/components/Engajamento";
import Add from "@/public/add.svg";
import Aluno from "@/components/Aluno";

export default function dashboardTurma(){
    return(
        <div className="flex flex-row w-full h-screen text-[#433F3F]">
            <Menu />
        
            <div className="flex justify-center items-center w-full">
                <div className="flex w-[1056px] flex-col h-full gap-[24px]">
                    <div className="flex flex-col w-full mt-[70px]">
                        <HeaderPag />
                    </div>
                    <div className="flex flex-row w-full justify-between">
                        <Estatistica tipo={1} valor={8} />
                        <Estatistica tipo={2} valor={74} />
                        <Estatistica tipo={3} valor={12} />
                    </div>
                    <Resumo tipo={2} txt="Lucas apresenta atenção fragmentada em tarefas longas, mas excelente desempenho em atividades curtas e gamificadas. Responde  bem a instruções visuais e recompensas imediatas. Sugere-se segmentar  atividades em blocos de no máximo 10 minutos." />
                    <Engajamento />
                    <div className="flex flex-col gap-[16px]">
                        <div className="flex flex-row justify-between items-center">
                            <p className="font-(family-name:--font-text-me-one) text-3xl">Histórico de Conversas</p>
                            <p className="text-sm text-[#797979]">5 conversas</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}