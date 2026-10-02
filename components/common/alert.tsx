import { twMerge } from "tailwind-merge";
import { CheckCircle, Info, Warning, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import type { TomAlerta } from "@/utils/alertas";

// icone de cada tom do alerta
const Icones: Record<TomAlerta, typeof WarningCircle> = {
  danger: WarningCircle,
  warning: Warning,
  success: CheckCircle,
  info: Info,
};

const Fundos: Record<TomAlerta, string> = {
  danger: "bg-surface-danger",
  warning: "bg-surface-warning",
  success: "bg-surface-success",
  info: "bg-surface-info",
};

// cor da descricao em cada tom do alerta
const Descricoes: Record<TomAlerta, string> = {
  danger: "text-ink",
  warning: "text-ink-muted",
  success: "text-ink-muted",
  info: "text-ink-muted",
};

interface AlertProps {
  tom: TomAlerta;
  titulo: string;
  descricao?: string;
  itens?: string[];
  className?: string;
}

export default function Alert({
  tom,
  titulo,
  descricao,
  itens,
  className = "",
}: AlertProps) {
  const Icone = Icones[tom];

  return (
    <div
      role="alert"
      className={twMerge(
        "flex w-fit max-w-[min(28rem,calc(100vw-1.5rem))] max-h-[min(22rem,50vh)] items-center gap-5 overflow-y-auto rounded-[70px] py-4 pl-6 pr-8",
        Fundos[tom],
        className,
      )}
    >
      <Icone weight="fill" size={51} className="shrink-0 text-ink" aria-hidden />

      <div className="flex min-w-0 flex-col gap-1">
        <span className="text-[18px] text-ink">{titulo}</span>

        {descricao && (
          <span className={`text-sm ${Descricoes[tom]} text-justify`}>
            {descricao}
          </span>
        )}

        {itens && itens.length > 0 && (
          <ul
            className={`flex list-disc flex-col pl-4 text-sm ${Descricoes[tom]}`}
          >
            {itens.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}