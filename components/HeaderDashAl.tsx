import Seta from "@/public/seta.svg";
import Button from "@/components/Button";
import Add from "@/public/add.svg";
import Download from "@/public/file_download.svg";

export default function HeaderPag(){
    return(
        <div className="flex flex-col gap-[15px] w-full">
            <div className="flex flex-row gap-[12px] cursor-pointer">
                <img src={Seta.src} className="w-[24px] h-[24px]" />
                <p className="text-base font-semibold text-[#797979]">3º Ano A - Manhã</p>
            </div>
            <div className="flex flex-row justify-between items-center">
                <div className="flex flex-row gap-3">
                    <div className="bg-[#D4C7F8] w-20 h-20 rounded-[70%] flex items-center justify-center text-[#433F3F] text-3xl font-bold">LO</div>
                    <div className="flex flex-col gap-1">
                        <p className="font-(family-name:--font-text-me-one) text-3xl">Lucas Olioti</p>
                        <div className="flex flex-row items-center gap-5 text-[#797979] text-sm">
                            <p>9 anos</p>
                            <div className="w-2 h-2 rounded-full bg-[#797979]"></div>
                            <p>3º Ano A - Manhã</p>
                        </div>
                        <div className="bg-[#CAF3FF] w-20 text-sm rounded-[50px] flex items-center justify-center">
                            <p>TDAH</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-row gap-5 h-8">
                    <Button type="button" className="flex flex-row gap-2 py-0 justify-center items-center">
                        <img src={Add.src} className="w-6 h-6"/>
                        <p className="font-(family-name:--font-text-me-one) text-xl">Bate-Papo</p>
                    </Button>
                    <Button type="button" className="flex flex-row gap-2 py-0 bg-[#FFD279] justify-center items-center">
                        <img src={Download.src} className="w-6 h-6"/>
                        <p className="font-(family-name:--font-text-me-one) text-xl">Gerar PEI</p>
                    </Button>
                </div>
            </div>
        </div>
    )
}