interface TagProps {
  label: string
}
const colorMap: Record<string, string> = {
  TDAH: 'bg-surface-info',        
  TEA: 'bg-surface-warning',       
  Dislexia: 'bg-surface-success',    
  Discalculia: 'bg-surface-danger-strong', 
  'AH/SD': 'bg-surface-accent',     
  Outro: 'bg-surface-tag-other',
}

export default function TagNeuro({ label }: TagProps) {
  const colorStyles = colorMap[label] || 'bg-surface-tag-other'

  return (
    <span className={`inline-block px-2.5! py-0.5! sm:px-4! rounded-full text-[10px] sm:text-xs! font-medium text-ink whitespace-nowrap ${colorStyles}`}>
      {label}
    </span>
  )
}