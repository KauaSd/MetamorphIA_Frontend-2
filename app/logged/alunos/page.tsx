import Menu from "@/components/Menu";
import HeaderPag from "@/components/HeaderPagAl";
import BarraPesquisa from "@/components/Input";
import Aluno from "@/components/Aluno";

export default function ViewAlunos(){
    const alunos = [
        {nome: "Junior Marcos", neuro: "TDAH", turma: "3º Ano A - Manhã"},
        {nome: "Julia Holanda", neuro: "TEA", turma: "3º Ano A - Manhã"},
        {nome: "Lucas Olioti", neuro: "TDAH", turma: "3º Ano A - Manhã"},
        {nome: "Rodrigo Mauro", neuro: "AH/SD", turma: "3º Ano A - Manhã"},
        {nome: "Sofia Gabriele", neuro: "Dislexia", turma: "3º Ano A - Manhã"},
    ]

    return (
        <div className="flex flex-row w-full h-screen">
            <Menu />
        
            <div className="flex justify-center items-center w-full">
                <div className="flex w-[1056px] flex-col h-full items-center">
                    <div className="flex flex-col w-full mt-[70px] gap-[15px]">
                        <HeaderPag />
                        <BarraPesquisa type="search" placeholder="Procurar alunos..."/>
                    </div>

                    <div className="grid flex-1 grid-cols-2 mt-[-150px] content-center gap-5">
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
    )
}