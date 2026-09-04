interface BarraPorcentagemProps {
    value: number
    materia: string
}
const colorMap: Record<string, string> = {
    leitura : "bg-[#FFD279]",
    matematica : "bg-[#CAF3FF]",
    ciencias : "bg-[#D4C7F8]",
}
export default function BarraPorcentagem( { value, materia } : BarraPorcentagemProps) {
    const pcnt = Math.min(Math.max(value, 0), 100)
     const colorStyles = colorMap[materia]
    return(
        <div className="w-full h-5.5 rounded-[50px] bg-[#D9D9D9] overflow-hidden"> 
            <div className={`h-full rounded-[50px] ${colorStyles} `} style={{width: `${pcnt}%`}}>

            </div>
        </div>
    )
}