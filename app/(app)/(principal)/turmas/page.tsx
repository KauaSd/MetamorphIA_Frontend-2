import ConteudoTurmas from "@/components/app/ConteudoTurmas";

// o padding horizontal acompanha o do dashboardTurma: md:px-64 deixava a
// coluna util negativa, porque a sidebar ja ocupa md:w-72
export default function ViewTurmas(){
    return (
        <div className="mx-auto flex w-full max-w-[1056px] flex-col px-5 sm:px-8 lg:px-12">
            <ConteudoTurmas />
        </div>
    )
}