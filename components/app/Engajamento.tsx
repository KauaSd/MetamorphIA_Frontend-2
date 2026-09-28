import BarraPorcentagem from "@/components/common/BarraPorcentagem";

type TipoStat = 1 | 2
interface EngajamentoProps{
    tipo: TipoStat
}
const CONFIG_TIPOS ={
    1: {
        titulo: "Engajamento por Área",
    },
    2: {
        titulo: "Perfil do Aluno",
    }
}

export default function Engajamento(props : EngajamentoProps){
    const config = CONFIG_TIPOS[props.tipo] || CONFIG_TIPOS[1];

    return(
        <div className="flex flex-col gap-[16px]">
            <p className="font-(family-name:--font-text-me-one) text-xl sm:text-2xl"> {config.titulo} </p>
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
