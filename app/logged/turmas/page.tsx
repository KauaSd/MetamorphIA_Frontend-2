import Menu from "@/components/Menu";
import HeaderPag from "@/components/HeaderPagTurmas";
import BarraPesquisa from "@/components/Input";
import Turma from "@/components/Turma";

export default function ViewTurmas(){
    const turmas = [
        {
            nomeTurma: "3º Ano A - Manhã",
            alunos: [
                {nome: "Junior M.", neuro: "TDAH", turma: "3º Ano A - Manhã"},
                {nome: "Julia H.", neuro: "TEA", turma: "3º Ano A - Manhã"},
                {nome: "Lucas O.", neuro: "TDAH", turma: "3º Ano A - Manhã"},
                {nome: "Rodrigo M.", neuro: "AH/SD", turma: "3º Ano A - Manhã"},
            ]
        },
         {
            nomeTurma: "3º Ano A - Manhã",
            alunos: [
                {nome: "Junior M.", neuro: "TDAH", turma: "3º Ano A - Manhã"},
                {nome: "Julia H.", neuro: "TEA", turma: "3º Ano A - Manhã"},
                {nome: "Lucas O.", neuro: "TDAH", turma: "3º Ano A - Manhã"},
                {nome: "Rodrigo M.", neuro: "AH/SD", turma: "3º Ano A - Manhã"},
            ]
        }
    ]

    return (
        <div className="flex flex-row w-full h-screen">
            <Menu />
        
            <div className="flex justify-center items-center w-full">
                <div className="flex w-[1056px] flex-col h-full items-center gap-10">
                    <div className="flex flex-col w-full mt-[70px] gap-[15px]">
                        <HeaderPag />
                        <BarraPesquisa type="search" placeholder="Procurar turmas..."/>
                    </div>

                    <div className="grid flex-1 grid-cols-2 gap-20">
                        {turmas.map((turma, index) => (
                            <Turma
                                key={index}
                                nomeTurma={turma.nomeTurma}
                                alunos={turma.alunos}
                            />
                        ))}
                    </div>
                    
                </div>
            </div>
        </div>
    )
}