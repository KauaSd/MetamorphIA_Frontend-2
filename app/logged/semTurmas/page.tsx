import Menu from "@/components/Menu";
import HeaderPag from "@/components/HeaderPagTurmas";
import BoxSemTurma from "@/components/BoxSemTurma";
import BarraPesquisa from "@/components/Input";

export default function HeaderTurmas(){
    return (
        <div className="flex flex-row w-full h-screen">
                <Menu />

            <div className="flex justify-center items-center w-full">
                <div className="flex w-[1056px] flex-col justify-center items-center">
                    <div className="flex flex-col mt-[70px] gap-[15px]">
                        <HeaderPag />
                        <BarraPesquisa type="search" placeholder="Procurar turmas..."/>
                    </div>

                    <div className="flex flex-1 justify-center items-center">
                        <BoxSemTurma />
                    </div>
                </div>
            </div>
        </div>
    )
}
