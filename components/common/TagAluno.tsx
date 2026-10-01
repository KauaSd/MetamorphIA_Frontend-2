interface TagProps {
  label: string
  nome: string
  ismenu?: boolean
}
const colorMap: Record<string, string> = {
  TDAH: 'bg-surface-info',        
  TEA: 'bg-surface-warning',       
  Dislexia: 'bg-surface-success',    
  Discalculia: 'bg-surface-danger-strong', 
  'AH/SD': 'bg-surface-accent',     
  Outro: 'bg-surface-tag-other',
}

export default function TagNeuro(props: TagProps) {
  const colorStyles = colorMap[props.label] || 'bg-surface-tag-other'

  return (
    <span className="flex gap-2 items-center w-full min-w-0">
      <div className={`h-3 w-3 shrink-0 rounded-full ${colorStyles}`}></div>
      <p className={`text-[10px] sm:text-xs truncate min-w-0 ${props.ismenu ? "text-inverse" : "text-secondary"}`}>
        {props.nome}
      </p>
    </span>
  )
}