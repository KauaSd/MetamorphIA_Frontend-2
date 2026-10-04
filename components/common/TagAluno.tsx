import { gradienteNeuro } from "@/utils/cores";

interface TagProps {
  nome: string
  /** todas as neurodivergencias: viram as fatias da bolinha */
  neuros: string[]
  ismenu?: boolean
  /** cor fechada, usada quando a bolinha e de uma turma e nao de um aluno */
  cor?: string
}

export default function TagAluno({ nome, neuros, ismenu, cor }: TagProps) {
  return (
    <span className="flex gap-2 items-center w-full min-w-0">
      {/* `cor` e uma classe do Tailwind (vem de corDoNome), entao vai no
          className; o gradiente das neurodivergencias e um valor CSS e vai no style */}
      <div
        className={`h-3 w-3 shrink-0 rounded-full ${cor ?? ""}`}
        style={cor ? undefined : { background: gradienteNeuro(neuros) }}
      />
      <p className={`text-[10px] sm:text-xs truncate min-w-0 ${ismenu ? "text-inverse" : "text-secondary"}`}>
        {nome}
      </p>
    </span>
  )
}