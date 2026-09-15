import DropDown from "@/components/DropDown";
import BarraPesquisa from "@/components/Input";

export default function HeaderRecentes(){
    const OpcoesDropDown = [
        {value: "data", label: "Data"},
        {value: "aluno", label: "Aluno"},
        {value: "turma", label: "Turma"},
        {value: "neuro", label: "Neurodivergência"}
    ]

    return(
        <div className="flex flex-col gap-4 sm:gap-[15px] w-full">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between w-full gap-4">
                <p className="text-2xl sm:text-3xl font-(family-name:--font-text-me-one)">Histórico de Conversas</p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-[13px] sm:items-center w-full lg:w-auto">
                    <div className="flex flex-row gap-2 items-center shrink-0">
                        <span className="hidden sm:inline text-sm text-[#797979] whitespace-nowrap">Ordenar por</span>
                        <DropDown options={OpcoesDropDown} />
                    </div>
                    <BarraPesquisa type="search" placeholder="Procurar mês, ano..." className="w-full sm:w-[220px] lg:w-[305px]" />
                </div>
            </div>
        </div>
    )
}