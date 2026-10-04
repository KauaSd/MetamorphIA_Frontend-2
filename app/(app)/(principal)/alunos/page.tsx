import ConteudoAlunos from "@/components/app/ConteudoAlunos";

// mesmo shell do dashboardTurma e da pagina de turmas
export default function ViewAlunos(){
    return (
        <div className="mx-auto flex w-full max-w-[1056px] flex-col px-5 sm:px-8 lg:px-12">
            <ConteudoAlunos />
        </div>
    )
}