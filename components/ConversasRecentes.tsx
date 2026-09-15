import TagNeuro from "./TagNeuro";
import { pegainicial } from "@/utils/pegariniciais";
interface RecentesProps {
  aluno: string;
  neuro: string;
  data: string;
  turma: string;
  chat: string;
}

function formatarData(data: Date): string {
  const [dia, mes, ano] = data.split("/");

  const dataFormatada = new Date(
    Number(ano),
    Number(mes) - 1,
    Number(dia)
  );

  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
    .format(dataFormatada)
    .replace(/ de /g, " ");
}

export default function ConversasRecentes(props: RecentesProps) {
  return (
    <div className="flex px-6 items-center justify-between w-full h-22! sm:h-25! md:h-27.5! bg-[#FFFDFA] rounded-[70px] text-[#433F3F]">
      <div className="flex gap-3 w-full">
        <div className="flex shrink-0 items-center justify-center w-14 h-14 rounded-full bg-[#FF9999] text-2xl font-extrabold">
          {pegainicial(props.aluno)}
        </div>
        <div className="flex flex-col gap-3 w-full">
        <div className="flex justify-between w-full">
          <a className="text-[16px] font-bold">
            {props.aluno} - {props.chat}
          </a>
          <a className="text-sm mr-0! sm:mr-12! md:mr-17!  "> {formatarData(props.data)} </a>
          </div>
          <div className="flex gap-2">
            <TagNeuro label={props.neuro} />
            <a className="text-sm">{props.turma}</a>
          </div>
        </div>

      </div>
    </div>
  );
}
