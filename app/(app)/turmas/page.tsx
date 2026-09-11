import Menu from "@/components/Menu";
import ConteudoTurmas from "@/components/ConteudoTurmas";

export default function ViewTurmas(){
    return (
        <div className="flex flex-row w-full h-screen">
            <Menu />
        
            <div className="flex justify-center w-full">
                <div>
                    <ConteudoTurmas />
                </div>
            </div>
        </div>
    )
}