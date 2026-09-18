interface TagProps {
  label: string
  nome: string
  ismenu?: boolean
}
const colorMap: Record<string, string> = {
  TDAH: 'bg-[#CAF3FF]',        
  TEA: 'bg-[#FFD279]',       
  Dislexia: 'bg-[#CEFFCA]',    
  Discalculia: 'bg-[#ff5154]', 
  'AH/SD': 'bg-[#D4C7F8]',     
  Outro: 'bg-[#948F9E]',
}

export default function TagNeuro(props: TagProps) {
  const colorStyles = colorMap[props.label] || 'bg-[#a77464]'

  return (
    <span className="flex gap-2 items-center w-full min-w-0">
      <div className={`h-3 w-3 shrink-0 rounded-full ${colorStyles}`}></div>
      <p className={`text-[10px] sm:text-xs truncate min-w-0 ${props.ismenu ? "text-[#FFFFFF]" : "text-[#797979]"}`}>
        {props.nome}
      </p>
    </span>
  )
}