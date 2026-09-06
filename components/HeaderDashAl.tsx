import Seta from "@/public/seta.svg";

export default function HeaderPag(){
    return(
        <div className="flex flex-col gap-[15px] w-full">
            <div className="flex flex-row gap-[12px] cursor-pointer">
                <img src={Seta.src} className="w-[24px] h-[24px]" />
                <p className="text-base font-semibold text-[#797979]">3º Ano A - Manhã</p>
            </div>
        </div>
    )
}