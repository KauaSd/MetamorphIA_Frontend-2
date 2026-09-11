import PersonSearch from "@/public/person_search.svg";
import Button from "@/components/Button";
import Link from 'next/link';

export default function ModalSemAluno(){
    return (
        <div className="bg-[#FFFDFA] w-[410px] h-[330px] rounded-[70px] flex flex-col justify-center items-center gap-[30px]">
            <div className="bg-[#D4C7F8] w-[100px] h-[100px] rounded-[100%] flex">
                <img src={PersonSearch.src} className="w-[60px] h-[60px] ml-[25px] mt-[15px]"/>
            </div>
            <div className="flex flex-col gap-[15px] justify-center items-center">
                <p className="text-[#433F3F] text-base">Nenhum aluno encontrado</p>
                <p className="text-[#797979] text-sm w-[330px] text-center">Adicione um aluno em uma de suas turmas para visualizá-lo nesta tela.</p>
            </div>
            <Link href="/logged/turmas">
                <Button type="button" className="w-[180px]">Ir para Turmas</ Button>
            </Link>
        </div>
    )
}