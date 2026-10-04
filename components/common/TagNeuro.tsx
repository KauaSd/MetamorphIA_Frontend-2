import { corPorNeuro } from "@/utils/cores";

interface TagProps {
  label: string
}

export default function TagNeuro({ label }: TagProps) {
  return (
    <span className={`inline-block px-2.5! py-0.5! sm:px-4! rounded-full text-[10px] sm:text-xs! font-medium text-ink whitespace-nowrap ${corPorNeuro(label)}`}>
      {label}
    </span>
  )
}