import Seta from "@/public/seta.svg";
import Button from "@/components/Button";
import Add from "@/public/add.svg";
import Download from "@/public/file_download.svg";

export default function HeaderPag(){
    return(
        <div className="flex w-full flex-col gap-4">
            <div className="flex flex-row gap-3 cursor-pointer">
                <img src={Seta.src} className="w-[24px] h-[24px]" />
                <p className="text-sm font-semibold text-[#797979] sm:text-base">3º Ano A - Manhã</p>
            </div>
            <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
                <div className="flex min-w-0 flex-row gap-3">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[70%] bg-[#D4C7F8] text-2xl font-bold text-[#433F3F] sm:h-20 sm:w-20 sm:text-3xl">LO</div>
                    <div className="flex flex-col gap-1">
                        <p className="font-(family-name:--font-text-me-one) text-2xl sm:text-3xl">Lucas Olioti</p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[#797979] sm:gap-5">
                            <p>9 anos</p>
                            <div className="w-2 h-2 rounded-full bg-[#797979]"></div>
                            <p>3º Ano A - Manhã</p>
                        </div>
                        <div className="bg-[#CAF3FF] w-20 text-sm rounded-[50px] flex items-center justify-center">
                            <p>TDAH</p>
                        </div>
                    </div>
                </div>
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-5 sm:h-8">
                    <Button type="button" className="flex flex-row items-center justify-center gap-2 py-2 sm:py-0">
                        <img src={Add.src} className="w-6 h-6"/>
                        <p className="font-(family-name:--font-text-me-one) text-xl">Bate-Papo</p>
                    </Button>
                    <Button type="button" className="flex flex-row items-center justify-center gap-2 bg-[#FFD279] py-2 sm:py-0">
                        <img src={Download.src} className="w-6 h-6"/>
                        <p className="font-(family-name:--font-text-me-one) text-xl">Gerar PEI</p>
                    </Button>
                </div>
            </div>
        </div>
    )
}
