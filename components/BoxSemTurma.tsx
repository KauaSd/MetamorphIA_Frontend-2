import PersonSearch from "@/public/person_search.svg";
import Button from "@/components/Button";
import GroupAdd from "@/public/group_add.svg";

interface BoxSemTurmaProps{
    onCriarTurma: () => void;
}

export default function ModalSemTurma({
    onCriarTurma,
}: BoxSemTurmaProps){
    return (
        <div className="bg-[#FFFDFA] w-full max-w-[410px] min-h-[280px] sm:min-h-[330px] rounded-[70px] flex flex-col justify-center items-center gap-6 sm:gap-[30px] p-6 sm:p-8 mx-4">
            <div className="bg-[#D4C7F8] w-14 sm:w-20 md:w-[100px] aspect-square shrink-0 rounded-full flex items-center justify-center">
                <img src={PersonSearch.src} className="w-8 h-8 sm:w-10 sm:h-10 md:w-[60px] md:h-[60px]" alt="" />
            </div>
            <div className="flex flex-col gap-3 sm:gap-[15px] justify-center items-center">
                <p className="text-[#433F3F] text-base text-center">Nenhuma turma encontrada</p>
                <p className="text-[#797979] text-sm w-full max-w-[330px] text-center">
                    Crie uma turma e adicione seus alunos para iniciar uma conversa com o contexto certo.
                </p>
            </div>
            <Button type="button" onClick={onCriarTurma} className="w-full max-w-[180px] flex flex-row gap-[10px] justify-center items-center">
                <img src={GroupAdd.src} className="flex w-5 h-5 sm:w-6 sm:h-6 md:w-[30px] md:h-[30px]" alt="" />
                Criar Turma
            </Button>
        </div>
    )
}