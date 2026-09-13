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
            <div className="flex flex-row items-center justify-between w-full gap-3">
                <p className="text-2xl sm:text-3xl font-(family-name:--font-text-me-one)">Turmas</p>

                <div className="flex flex-row gap-2 sm:gap-[13px] items-center shrink-0">
                    <span className="hidden sm:inline text-sm text-[#797979] whitespace-nowrap">Ordenar por</span>
                    <DropDown options={OpcoesDropDown} />

                    <button type="button" onClick={onCriarTurma} aria-label="Criar Turma" className="flex w-9 h-9 sm:w-10 sm:h-10 bg-[#D4C7F8] rounded-full justify-center items-center cursor-pointer hover:bg-[#AB97E0] shrink-0">
                        <img src={GroupAdd.src} className="flex w-6 h-6 sm:w-7 sm:h-7" alt="" />
                    </button>
                </div>
            </div>
        </div>
    )
}