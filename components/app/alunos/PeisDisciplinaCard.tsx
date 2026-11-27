import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Conversa, PeisPorDisciplinaResumo, StatusPeiDisciplina } from "@/utils/data/types";

interface PeisDisciplinaCardProps {
  dados: PeisPorDisciplinaResumo;
  alunoId?: string;
  conversas?: Conversa[];
}

function normalizarDisc(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function encontrarConversaDaDisciplina(
  disciplina: string,
  conversas: Conversa[],
): Conversa | undefined {
  const alvo = normalizarDisc(disciplina);
  const aliases = [alvo];
  if (alvo.includes("fisica") && (alvo.includes("ed") || alvo.includes("educacao"))) {
    aliases.push("ed fisica", "educacao fisica", "ed_fisica");
  }
  if (alvo.includes("portugues")) aliases.push("portugues", "l portuguesa", "lingua portuguesa");
  if (alvo.includes("ingles")) aliases.push("ingles", "l inglesa", "lingua inglesa");

  return conversas.find((conv) => {
    const titulo = normalizarDisc(conv.titulo);
    const msgs = normalizarDisc(conv.mensagens.map((m) => m.texto).join(" "));
    return aliases.some((a) => titulo.includes(a) || msgs.includes(`pei de ${a}`) || msgs.includes(`pei - ${a}`));
  });
}

const COR_STATUS_DISCIPLINA: Record<StatusPeiDisciplina, string> = {
  concluido: "bg-surface-success-strong",
  em_andamento: "bg-surface-warning-strong",
  nao_iniciado: "bg-[#FF9999]",
};

function periodoPassou(proximoPeriodo?: string | null): boolean {
  if (!proximoPeriodo) return false;
  const matches = proximoPeriodo.match(/\d{2}\/\d{2}\/\d{2,4}/g);
  if (!matches || matches.length === 0) return false;
  const ultimaData = matches[matches.length - 1];
  const [dia, mes, anoStr] = ultimaData.split("/");
  const ano = anoStr.length === 2 ? 2000 + Number(anoStr) : Number(anoStr);
  const fimPeriodo = new Date(ano, Number(mes) - 1, Number(dia), 23, 59, 59);
  if (Number.isNaN(fimPeriodo.getTime())) return false;
  return Date.now() > fimPeriodo.getTime();
}

function resolverStatusGeralPei(dados: PeisPorDisciplinaResumo): {
  label: string;
  cor: string;
} {
  if (dados.total > 0 && dados.concluidos >= dados.total) {
    return { label: "CONCLUÍDO", cor: "text-secondary" };
  }
  if (
    dados.atrasado ||
    dados.statusGeral.toUpperCase().includes("PENDENTE") ||
    periodoPassou(dados.proximoPeriodo)
  ) {
    return { label: "PENDENTE", cor: "text-[#FF9999]" };
  }
  const algumaIniciada =
    dados.concluidos > 0 ||
    dados.disciplinas.some((d) => d.status !== "nao_iniciado");
  if (
    !algumaIniciada ||
    dados.statusGeral.toUpperCase().includes("NÃO INICIAD") ||
    dados.statusGeral.toUpperCase().includes("NAO INICIAD")
  ) {
    return { label: "NÃO INICIADA", cor: "text-[#FF9999]" };
  }
  return { label: "EM ANDAMENTO", cor: "text-warning" };
}

export default function PeisDisciplinaCard({
  dados,
  alunoId,
  conversas = [],
}: PeisDisciplinaCardProps) {
  const statusGeral = resolverStatusGeralPei(dados);

  return (
    <div className="flex w-full flex-col gap-3 rounded-[50px] bg-surface-base px-8 py-4 lg:h-[277px]">
      <div className="flex flex-col gap-0.5">
        <h2 className="font-(family-name:--font-text-me-one) text-xl text-primary sm:text-2xl lg:text-[24px] lg:leading-tight">
          PEIs por Disciplina
        </h2>
        <p className="font-(family-name:--font-poppins) text-sm text-secondary sm:text-base lg:text-[18px] lg:leading-snug">
          Status:{" "}
          <span className={`font-bold uppercase ${statusGeral.cor}`}>
            {statusGeral.label} ({dados.concluidos}/{dados.total})
          </span>
        </p>
      </div>

      {dados.disciplinas.length === 0 ? (
        <p className="py-3 text-center font-(family-name:--font-poppins) text-xs text-secondary">
          Nenhuma disciplina cadastrada ainda.
        </p>
      ) : (
        <div className="flex max-h-[130px] flex-col gap-1.5 overflow-y-auto pr-2">
          {dados.disciplinas.map((item) => {
            const conversaMatch = encontrarConversaDaDisciplina(item.disciplina, conversas);
            const href = conversaMatch
              ? `/chat?conversaId=${conversaMatch.id}`
              : item.status === "concluido"
                ? conversas.length > 0
                  ? `/chat?conversaId=${conversas[0].id}`
                  : alunoId
                    ? `/chat?alunoId=${alunoId}`
                    : null
                : alunoId
                  ? `/chat?alunoId=${alunoId}&gerarPei=true&nova=true`
                  : null;
            const conteudo = (
              <>
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${COR_STATUS_DISCIPLINA[item.status]}`}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 truncate font-(family-name:--font-poppins) text-xs text-primary">
                  {item.disciplina}
                </span>
                {href ? (
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-secondary" aria-hidden="true" />
                ) : null}
              </>
            );
            return href ? (
              <Link
                key={item.id}
                href={href}
                title={
                  conversaMatch
                    ? `Abrir conversa do PEI de ${item.disciplina}`
                    : `Criar PEI de ${item.disciplina}`
                }
                className="flex h-7 shrink-0 items-center gap-2 rounded-full bg-surface-muted px-3 transition-colors hover:bg-surface-base-hover"
              >
                {conteudo}
              </Link>
            ) : (
              <div
                key={item.id}
                className="flex h-7 shrink-0 items-center gap-2 rounded-full bg-surface-muted px-3"
              >
                {conteudo}
              </div>
            );
          })}
        </div>
      )}

      {(dados.ultimoEnvio || dados.proximoPeriodo) && (
        <div className="mt-auto flex flex-col gap-0.5 font-(family-name:--font-poppins) text-[11px] text-secondary lg:text-[12px]">
          {dados.ultimoEnvio ? <p>Último envio : {dados.ultimoEnvio}</p> : null}
          {dados.proximoPeriodo ? <p>Próx. período: {dados.proximoPeriodo}</p> : null}
        </div>
      )}
    </div>
  );
}
