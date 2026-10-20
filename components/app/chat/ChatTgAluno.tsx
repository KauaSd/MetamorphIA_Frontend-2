import { pegainicial } from "@/utils/pegariniciais";
import { corDoNome } from "@/utils/cores";

interface ChatTgAlunoProps {
  nome: string;
  neuro: string;
}

export default function ChatTgAluno({ nome, neuro }: ChatTgAlunoProps) {
  const corAvatar = corDoNome(nome);

  return (
    <div
      className="
          flex
          items-center
          gap-3
          sm:gap-5
          w-[84vw]
          sm:w-80
          max-w-86
          h-16
          sm:h-20
          px-3
          sm:px-4
          bg-surface-base
          rounded-[70px]
      "
    >
      {/* avatar do aluno */}
      <div
        className={`
          flex
          items-center
          justify-center
          w-14
          h-14
          sm:w-17.5
          sm:h-17.5
          shrink-0
          rounded-full
          ${corAvatar}
        `}
      >
        <p className="font-bold text-xl sm:text-3xl text-ink">{pegainicial(nome)}</p>
      </div>

      {/* nome e neurodivergencia */}
      <div className="flex flex-col flex-1 min-w-0 gap-1">
        <p className="font-bold text-sm sm:text-base text-primary truncate">{nome}</p>

        <div className="flex items-center gap-5 min-w-0">
          <p className="font-bold text-sm text-secondary shrink-0">{neuro}</p>

          <div className="min-w-0 flex-1">
            <div
              className="
                flex
                items-center
                justify-center
                w-full
                max-w-27
                h-6
                rounded-full
                bg-surface-warning
              "
            >
              <p className="font-bold text-sm text-ink whitespace-nowrap">PEI ativo</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}