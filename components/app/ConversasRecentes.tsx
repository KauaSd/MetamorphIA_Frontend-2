import TagNeuro from "@/components/common/TagNeuro";
import { pegainicial } from "@/utils/pegariniciais";
interface RecentesProps {
    aluno: string;
    neuro: string;
    data: string;
    turma: string;
    chat: string;
}

function formatarData(data: string): string {
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
        <div className="flex flex-col sm:flex-row px-4 sm:px-6 py-4 sm:py-0 sm:items-center gap-3 sm:gap-0 justify-between w-full min-h-[88px] sm:h-25 md:h-27.5 bg-[#FFFDFA] rounded-[32px] sm:rounded-[70px] text-[#433F3F]">
            <div className="flex gap-3 w-full min-w-0">
                <div className="flex shrink-0 items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#FF9999] text-lg sm:text-2xl font-extrabold">
                    {pegainicial(props.aluno)}
                </div>
                <div className="flex flex-col gap-2 sm:gap-3 w-full min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-3 w-full">
                        <a className="text-sm sm:text-[16px] font-bold sm:truncate sm:min-w-0">
                            {props.aluno} - {props.chat}
                        </a>
                        <a className="text-xs sm:text-sm text-[#797979] sm:text-[#433F3F] shrink-0 mr-10">
                            {formatarData(props.data)}
                        </a>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                        <TagNeuro label={props.neuro} />
                        <a className="text-xs sm:text-sm">{props.turma}</a>
                    </div>
                </div>
            </div>
        </div>
    );
}