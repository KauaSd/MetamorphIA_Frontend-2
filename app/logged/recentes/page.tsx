import Menu from "@/components/Menu";
import HeaderPag from "@/components/HeaderRecentes";

export default function Recentes(){
    return(
        <div className="flex flex-row w-full h-screen">
                        <Menu />
        
                    <div className="flex justify-center items-center w-full">
                        <div className="flex w-[1056px] flex-col h-full items-center">
                            <div className="flex flex-col w-full mt-[70px] gap-[15px]">
                                <HeaderPag />
                            </div>
        
                            <div className="flex flex-1 items-center mt-[-100px]">
                                
                            </div>
                        </div>
                    </div>
                </div>
    )
}