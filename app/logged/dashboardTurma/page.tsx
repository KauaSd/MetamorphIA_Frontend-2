import Menu from "@/components/Menu";
import HeaderPag from "@/components/HeaderDashTurma";
import Estatistica from "@/components/CardEstatisticaTurma";
import Resumo from "@/components/Resumo";
import Button from "@/components/Button";
import Engajamento from "@/components/Engajamento";
import Add from "@/public/add.svg";
import Aluno from "@/components/Aluno";

export default function dashboardTurma(){
    const alunos = [
        {nome: "Junior Marcos", neuro: "TDAH", turma: "3º Ano A - Manhã"},
        {nome: "Julia Holanda", neuro: "TEA", turma: "3º Ano A - Manhã"},
        {nome: "Lucas Olioti", neuro: "TDAH", turma: "3º Ano A - Manhã"},
        {nome: "Rodrigo Mauro", neuro: "AH/SD", turma: "3º Ano A - Manhã"},
        {nome: "Sofia Gabriele", neuro: "Dislexia", turma: "3º Ano A - Manhã"},
    ]

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
                    <Resumo tipo={1} txt="A turma apresenta perfil heterogêneo de aprendizagem. 5 alunos possuem laudos ou suspeitas de neurodivergência (TDAH, TEA,  Dislexia). A maioria responde bem a atividades visuais e instruções  segmentadas. Recomenda-se uso de recursos multissensoriais e tempos  flexíveis nas avaliações." />
                    <Engajamento />
                    <div className="flex flex-col gap-[16px]">
                        <div className="flex flex-row justify-between items-center">
                            <p className="font-(family-name:--font-text-me-one) text-3xl">Alunos</p>
                            <Button type="button" className="flex flex-row w-[210px] gap-[16px]">
                                <img src={Add.src}  />
                                <p className="text-[#433F3F] font-(family-name:--font-text-me-one) text-2xl">Novo Aluno</p>
                            </ Button>
                        </div>
                        <div className="grid grid-cols-2 w-full gap-5">
                        {alunos.map((aluno, index) => (
                            <Aluno
                                key={aluno.nome}
                                nome={aluno.nome}
                                Neuro={aluno.neuro}
                                Turma={aluno.turma}
                                index={index}
                            />
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}