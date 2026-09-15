import Menu from "@/components/Menu";
import ConteudoTurmas from "@/components/ConteudoTurmas";

export default function ViewTurmas(){
    return (
        <div className="flex flex-row w-full h-screen">
            <Menu />
        
            <div className="flex justify-center w-full px-10! sm:px-15! md:px-64!">
                    <ConteudoTurmas />
            </div>
        </div>
    )
}