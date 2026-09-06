import Menu from "@/components/Menu";
import HeaderPag from "@/components/HeaderDashTurma";
import Estatistica from "@/components/CardEstatistica";
import Resumo from "@/components/Resumo";
import Button from "@/components/Button";
import Engajamento from "@/components/EngajamentoTurma";

export default function dashboardTurma(){
    return(
        <div className="flex flex-row w-full h-screen">
            <Menu />
        
            <div className="flex justify-center items-center w-full">
                <div className="flex w-[1056px] flex-col h-full gap-[24px]">
                    <div className="flex flex-col w-full mt-[70px]">
                        <HeaderPag />
                    </div>
                    <div className="flex flex-col gap-[16px]">
                        <p className="text-lg text-[#797979] font-semibold">Contextualização geral da turma</p>
                        <div className="flex flex-row w-full justify-between">
                            <Estatistica tipo={1} valor={18} subtexto={3} />
                            <Estatistica tipo={2} valor={5} subtexto={28} />
                            <Estatistica tipo={3} valor={12} />
                        </div>
                    </div>
                    <div>
                        <Resumo tipo={1} txt="A turma apresenta perfil heterogêneo de aprendizagem. 5 alunos possuem laudos ou suspeitas de neurodivergência (TDAH, TEA,  Dislexia). A maioria responde bem a atividades visuais e instruções  segmentadas. Recomenda-se uso de recursos multissensoriais e tempos  flexíveis nas avaliações." />
                    </div>
                    <Engajamento />
                    <div>
                        <div>
                            <p>Alunos</p>
                            <Button type="button">
                                <p>Novo Aluno</p>
                            </ Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}