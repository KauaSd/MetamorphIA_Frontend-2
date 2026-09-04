import Icon from "@/public/icon.png";
export default function Menu(){
    return(
        <div className="bg-[#433F3F] w-1/5 h-screen p-[15px] flex flex-col gap-[1rem]">
            <div className="flex flex-row items-center gap-[10px]">
                <img 
                    src={Icon.src}
                    alt=""
                    className="h-[45px] w-[45px] pointer-events-none select-none" 
                />
                <h1 className="text-[#FFFDFA] text-3xl font-(family-name:--font-text-me-one)">
                    MetamorphIA
                </h1>
            </div>

            <div className="flex flex-row items-center
bg-[#FFFDFA] h-[1px] w-[100%] mx-auto"> 
            </div>

            <div className="w-[100%] h-[37px] bg-[red] flex justify-center items-center rounded-[70px]">
                Turmas
            </div>
        </div>
    )
}