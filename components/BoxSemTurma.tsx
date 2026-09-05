import PersonSearch from "@/public/person_search.svg";
import Button from "@/components/Button";
import GroupAdd from "@/public/group_add.svg";

export default function ModalSemAluno(){
    return (
        <div className="bg-[#FFFDFA] w-[410px] h-[330px] rounded-[70px] flex flex-col justify-center items-center gap-[30px]">
            <div className="bg-[#D4C7F8] w-[100px] h-[100px] rounded-[100%] flex">
                <img src={PersonSearch.src} className="w-[60px] h-[60px] ml-[25px] mt-[15px]"/>
            </div>
            <div className="flex flex-col gap-[15px] justify-center items-center">
                <p className="text-[#433F3F] text-base">Nenhuma turma encontrada</p>
                <p className="text-[#797979] text-sm w-[330px] text-center">Crie uma turma e adicione seus alunos para iniciar uma conversa com o contexto certo.</p>
            </div>
            <Button type="button" className="w-[180px] flex flex-row gap-[10px] justify-center items-center">
                <img src={GroupAdd.src} className="flex w-[30px] h-[30px]" />
                Criar Turma
            </ Button>
        </div>
    )
}