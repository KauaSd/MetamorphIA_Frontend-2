import Seta from "@/public/seta.svg";

export default function HeaderPag(){
    return(
        <div className="flex flex-col gap-[15px] w-full">

            <div className="flex flex-row gap-[12px] cursor-pointer">
                <img src={Seta.src} className="w-[24px] h-[24px]" />
                <p className="text-base font-semibold text-[#797979]">Todas as Turmas</p>
            </div>

            <div className="flex flex-col gap-[5px]">
                <p className="font-(family-name:--font-text-me-one) text-3xl text-[#433F3F]">3º Ano A - Manhã</p>
                <div className="bg-[#CAF3FF] w-[80px] h-[22px] rounded-[70px] flex justify-center items-center">
                    <p className="text-sm text-[#433F3F]">18 alunos</p>
                </div>
            </div>
        </div>
    )
}