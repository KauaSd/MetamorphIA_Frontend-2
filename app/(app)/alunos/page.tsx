import Menu from "@/components/app/Menu";
import ConteudoAlunos from "@/components/app/ConteudoAlunos";

export default function ViewAlunos(){
    return (
        <div className="flex flex-row w-full h-screen">
            <Menu />
        
            <div className="flex justify-center w-full px-10! sm:px-15! md:px-64!">
                    <ConteudoAlunos />
            </div>
        </div>
    )
}