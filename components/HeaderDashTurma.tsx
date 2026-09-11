import Seta from "@/public/seta.svg";

export default function HeaderPag(){
    return(
        <div className="flex w-full flex-col gap-4">

            <div className="flex flex-row gap-[12px] cursor-pointer">
                <img src={Seta.src} className="w-[24px] h-[24px]" />
                <p className="text-sm font-semibold text-[#797979] sm:text-base">Todas as Turmas</p>
            </div>

            <div className="flex flex-col gap-[5px]">
                <p className="font-(family-name:--font-text-me-one) text-2xl text-[#433F3F] sm:text-3xl">3º Ano A - Manhã</p>
                <div className="bg-[#CAF3FF] w-[80px] h-[22px] rounded-[70px] flex justify-center items-center">
                    <p className="text-sm text-[#433F3F]">18 alunos</p>
                </div>
            </div>
        </div>
    )
}
