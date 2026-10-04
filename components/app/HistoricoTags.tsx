import Link from "next/link";
import { formatarData } from "@/utils/datas";

interface HistoricoProps {
  data: string;
  chat: string;
  /** quando existe, o item inteiro vira um link para a conversa */
  href?: string;
}

export default function HistoricoTags(props: HistoricoProps) {
  const conteudo = (
    <>
      <div className="flex h-9! w-9! shrink-0 items-center justify-center rounded-full bg-surface-inverse font-extrabold sm:h-10! sm:w-10! md:h-11! md:w-11!">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_394_535)">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM9 11H7V9H9V11ZM13 11H11V9H13V11ZM17 11H15V9H17V11Z" fill="var(--inverse)"/>
          </g>
          <defs>
            <clipPath id="clip0_394_535">
              <rect width="24" height="24" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      </div>
      <div className="flex min-w-0 flex-col">
        {/* a conversa pode ter titulo longo, entao corta em uma linha */}
        <p className="truncate text-[11px]! text-primary sm:text-[12px]! md:text-[15px]!">
          {props.chat}
        </p>
        <p className="mr-0! text-[9px]! text-secondary sm:mr-10! md:mr-14! md:text-xs!">
          {formatarData(props.data)}
        </p>
      </div>
    </>
  );

  const classe = "flex w-full items-center gap-3 rounded-[70px] bg-surface-base px-5 py-2.5 sm:px-6";

  // o link fica por fora do conteudo para nao aninhar ancora em ancora
  if (props.href) {
    return (
      <Link href={props.href} className={`${classe} cursor-pointer`}>
        {conteudo}
      </Link>
    );
  }

  return <div className={classe}>{conteudo}</div>;
}