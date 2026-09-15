interface HistoricoProps {
  data: Date;
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

export default function ConversasRecentes(props: HistoricoProps) {
  return (
    <div className="flex px-6 items-center gap-4 w-full h-15 sm:h-22! md:h-10 bg-[#FFFDFA] rounded-[70px]">
    <div className="flex shrink-0 items-center justify-center w-14 h-14 rounded-full bg-[#433F3F] text-2xl font-extrabold">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_394_535)">
<path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM9 11H7V9H9V11ZM13 11H11V9H13V11ZM17 11H15V9H17V11Z" fill="#FFFDFA"/>
</g>
<defs>
<clipPath id="clip0_394_535">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>

    </div>
    <div className="flex flex-col ">
        <a className="text-[18px] text-[#433F3F]">{props.chat}</a>
          <a className="text-sm mr-0! sm:mr-12! md:mr-17! text-[#797979]"> {formatarData(props.data)} </a>
          </div>
    </div>
  );
}
