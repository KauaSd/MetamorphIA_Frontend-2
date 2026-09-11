import DropDown from "@/components/DropDown";
import GroupAdd from "@/public/group_add.svg";

interface HeaderPagProps{
    onCriarTurma: () => void;
}

export default function HeaderPag({ onCriarTurma }: HeaderPagProps){
    const OpcoesDropDown = [
        {value: "az", label: "A-Z"},
        {value: "recente", label: "Atividade"}
    ]

    return(
        <div className="flex flex-col gap-[15px] w-full">
            <div className="flex flex-row justify-between w-full">
                <p className="text-3xl font-(family-name:--font-text-me-one)">Turmas</p>
                
                <div className="flex flex-row gap-[13px] items-center">
                    <span className="text-sm text-[#797979]">Ordenar por</span>
                    <DropDown options={OpcoesDropDown} />
                    
                    <button type="button" onClick={onCriarTurma} aria-label="Criar Turma" className="flex w-10 h-10 bg-[#D4C7F8] rounded-[100%] justify-center items-center cursor-pointer hover:bg-[#AB97E0]">
                        <img src={GroupAdd.src} className="flex w-7 h-7" />
                    </button>
                </div>
            </div>
        </div>
    )
}