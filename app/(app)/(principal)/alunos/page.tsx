import ConteudoAlunos from "@/components/app/alunos/ConteudoAlunos";

// mesmo shell do dashboardTurma e da pagina de turmas
export default function ViewAlunos(){
    return (
        <div className="mx-auto flex w-full max-w-[1056px] flex-col px-5 sm:px-8 lg:max-w-none lg:px-12 xl:px-[clamp(48px,13.5vw,259px)]">
            <ConteudoAlunos />
        </div>
    )
}