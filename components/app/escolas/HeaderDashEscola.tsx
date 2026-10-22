import Seta from "@/public/seta.svg";
import Link from "next/link";

interface HeaderDashEscolaProps {
  nomeEscola?: string;
  totalTurmas?: number;
}

export default function HeaderDashEscola({
  nomeEscola = "",
  totalTurmas = 0,
}: HeaderDashEscolaProps) {
  return (
    <div className="flex w-full flex-col gap-4">
      <Link href="/escolas">
        <div className="flex flex-row gap-[12px] cursor-pointer">
          <img src={Seta.src} className="w-[24px] h-[24px]" alt="" />
          <p className="text-sm font-semibold text-secondary sm:text-base">
            Todas as Escolas
          </p>
        </div>
      </Link>

      <div className="flex flex-col gap-[5px]">
        <p className="font-(family-name:--font-text-me-one) text-2xl text-primary sm:text-3xl">
          {nomeEscola || "Escola"}
        </p>
        <div className="bg-surface-info inline-flex h-[22px] rounded-[70px] items-center justify-center px-2 self-start">
          <p className="text-sm text-ink">
            {totalTurmas} {totalTurmas === 1 ? "turma" : "turmas"}
          </p>
        </div>
      </div>
    </div>
  );
}
