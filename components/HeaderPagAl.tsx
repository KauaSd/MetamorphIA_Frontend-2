import DropDown from "@/components/DropDown";

export default function HeaderPag(){
    const OpcoesDropDown = [
        {value: "az", label: "A-Z"},
        {value: "recente", label: "Atividade"}
    ]

    return(
        <div className="flex flex-col gap-[15px] w-full">
            <div className="flex flex-row justify-between w-full">
                <p className="text-3xl font-(family-name:--font-text-me-one)">Alunos</p>
                <div className="flex flex-row gap-[13px] items-center">
                    <span className="text-sm text-[#797979]">Ordenar por</span>
                        <DropDown options={OpcoesDropDown} />
                </div>
            </div>
        </div>
    )
}