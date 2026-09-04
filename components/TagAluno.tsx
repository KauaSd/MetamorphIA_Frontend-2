interface TagProps {
  label: string
  nome: string
}
const colorMap: Record<string, string> = {
  TDAH: 'bg-[#CAF3FF]',        
  TEA: 'bg-[#FFD279]',       
  Dislexia: 'bg-[#CEFFCA]',    
  Discalculia: 'bg-[#ff5154]', 
  'AH/SD': 'bg-[#D4C7F8]',     
  Outro: 'bg-[#948F9E]',
}

export default function TagNeuro( props: TagProps) {
  const colorStyles = colorMap[props.label] || 'bg-[#a77464]'

  return (
    <span className="flex gap-2 items-center">
      <div  className={`h-3.5 w-3.5 rounded-full ${colorStyles}`}></div>
      <p className="text-[#797979] text-sm text-justify">{[props.nome]}</p>
    </span>
  )
}