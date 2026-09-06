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
        <div className="flex flex-col gap-[15px] w-full">
            <div className="flex flex-row justify-between w-full">
                <p className="text-3xl font-(family-name:--font-text-me-one)">Histórico de Conversas</p>
                
                <div className="flex flex-row gap-[13px] items-center">
                    <span className="text-sm text-[#797979]">Ordenar por</span>
                    <DropDown options={OpcoesDropDown} />
                    <BarraPesquisa type="search" placeholder="Procurar mês, ano..." className="w-[305px]" />
                </div>
            </div>
        </div>
    )
}