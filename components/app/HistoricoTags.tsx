interface HistoricoProps {
  data: string;
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

export default function ConversasRecentes(props: HistoricoProps) {
  return (
    <div className="flex px-5 py-2.5 sm:px-6 sm:py-2.5 items-center gap-3 w-full bg-[#FFFDFA] rounded-[70px]">
    <div className="flex shrink-0 items-center justify-center h-9! w-9! sm:h-10! sm:w-10!  md:w-11! md:h-11! rounded-full bg-[#433F3F] font-extrabold">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <a className=" text-[11px]! md:text-[15px]! sm:text-[12px]! text-[#433F3F]">{props.chat}</a>
          <a className="text-[9px]! mr-0! md:text-xs! sm:mr-10! md:mr-14! text-[#797979]"> {formatarData(props.data)} </a>
          </div>
    </div>
  );
}
