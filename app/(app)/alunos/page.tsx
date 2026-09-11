import Menu from "@/components/Menu";
import ConteudoAlunos from "@/components/ConteudoAlunos";

export default function ViewAlunos(){
    return (
        <div className="flex flex-row w-full h-screen">
            <Menu />
        
            <div className="flex justify-center w-full">
                <div>
                    <ConteudoAlunos />
                </div>
            </div>
        </div>
    )
}