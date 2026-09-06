import BarraPorcentagem from "@/components/BarraPorcentagem";

export default function Engajamento(){
    return(
        <div className="flex flex-col gap-[16px]">
            <p className="font-(family-name:--font-text-me-one) text-3xl">Engajamento por Área</p>
            <div>
                <div className="flex flex-row justify-between w-full text-[#797979]">
                    <p>Leitura e Escrita</p>
                    <p>62%</p>
                </div>
                <BarraPorcentagem value={62} materia="leitura" />
            </div>
            <div>
                <div className="flex flex-row justify-between w-full text-[#797979]">
                    <p>Matemática</p>
                    <p>78%</p>
                </div>
                <BarraPorcentagem value={78} materia="matematica" />
            </div>
            <div>
                <div className="flex flex-row justify-between w-full text-[#797979]">
                    <p>Ciências</p>
                    <p>85%</p>
                </div>
                <BarraPorcentagem value={85} materia="ciencias" />
            </div>
        </div>
    )
}