interface BarraPorcentagemProps {
    value: number
    materia: string
}
const colorMap: Record<string, string> = {
    leitura : "bg-surface-warning",
    matematica : "bg-surface-info",
    ciencias : "bg-surface-accent",
}
export default function BarraPorcentagem( { value, materia } : BarraPorcentagemProps) {
    const pcnt = Math.min(Math.max(value, 0), 100)
     const colorStyles = colorMap[materia]
    return(
        <div className="w-full h-5.5 rounded-[50px] bg-sunken overflow-hidden">
            <div className={`h-full rounded-[50px] ${colorStyles} `} style={{width: `${pcnt}%`}}></div>
        </div>
    )
}