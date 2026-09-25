import DropDown from "@/components/common/DropDown";

export default function HeaderPagAl(){
    const OpcoesDropDown = [
        {value: "az", label: "A-Z"},
        {value: "recente", label: "Atividade"}
    ]

    return(
        <div className="flex flex-col gap-[15px] w-full">
            <div className="flex flex-row items-center justify-between w-full gap-3">
                <p className="text-2xl sm:text-3xl font-(family-name:--font-text-me-one)">Alunos</p>
                <div className="flex flex-row gap-2 sm:gap-[13px] items-center shrink-0">
                    <span className="hidden sm:inline text-sm text-[#797979] whitespace-nowrap">Ordenar por</span>
                    <DropDown options={OpcoesDropDown} small />
                </div>
            </div>
        </div>
    )
}