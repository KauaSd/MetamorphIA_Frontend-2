interface TagProps {
  label: string
}
const colorMap: Record<string, string> = {
  TDAH: 'bg-[#CAF3FF]',        
  TEA: 'bg-[#FFD279]',       
  Dislexia: 'bg-[#CEFFCA]',    
  Discalculia: 'bg-[#ff5154]', 
  'AH/SD': 'bg-[#D4C7F8]',     
  Outro: 'bg-[#948F9E]',
}

export default function TagNeuro({ label }: TagProps) {
  const colorStyles = colorMap[label] || 'bg-[#a77464]'

  return (
    <span className={`inline-block px-2.5! py-0.5! sm:px-4! rounded-full text-[10px] sm:text-xs! font-medium text-[#433F3F] whitespace-nowrap ${colorStyles}`}>
      {label}
    </span>
  )
}