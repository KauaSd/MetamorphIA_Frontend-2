import PersonSearch from "@/public/person_search.svg";
import ButtonLink from "@/components/common/ButtonLink";

export default function ModalSemAluno(){
    return (
        <div className="bg-[#FFFDFA] w-full max-w-[410px] min-h-[280px] sm:min-h-[330px] rounded-[70px] flex flex-col justify-center items-center gap-6 sm:gap-[30px] p-6 sm:p-8">
            <div className="bg-[#D4C7F8] w-14 sm:w-20 md:w-[100px] aspect-square shrink-0 rounded-full flex items-center justify-center">
                <img src={PersonSearch.src} className="w-8 h-8 sm:w-10 sm:h-10 md:w-[60px] md:h-[60px]" alt="" />
            </div>
            <div className="flex flex-col gap-3 sm:gap-[15px] justify-center items-center">
                <p className="text-[#433F3F] text-base text-center">Nenhum aluno encontrado</p>
                <p className="text-[#797979] text-sm w-full max-w-[330px] text-center">
                    Adicione um aluno em uma de suas turmas para visualizá-lo nesta tela.
                </p>
            </div>
            <ButtonLink href="/turmas" className="w-full max-w-[180px] px-3 py-1 sm:px-4 sm:py-1">
                Ir para Turmas
            </ButtonLink>
        </div>
    )
}