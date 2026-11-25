import type { MetaBimestreItem, StatusMetaBimestre } from "@/utils/data/types";

interface MetasBimestreCardProps {
  metas: MetaBimestreItem[];
}

const CONFIG_STATUS_META: Record<
  StatusMetaBimestre,
  { rotulo: string; classe: string }
> = {
  em_progresso: {
    rotulo: "Em progresso",
    classe: "bg-surface-warning text-inverse",
  },
  a_iniciar: {
    rotulo: "A iniciar",
    classe: "bg-surface-danger text-inverse",
  },
  atingida: {
    rotulo: "Atingida",
    classe: "bg-surface-accent text-inverse",
  },
};

export default function MetasBimestreCard({ metas }: MetasBimestreCardProps) {
  return (
    <div className="flex w-full flex-col gap-2.5 rounded-[50px] bg-surface-base px-8 py-4 lg:h-[257px]">
      <h2 className="font-(family-name:--font-text-me-one) text-xl text-primary sm:text-2xl lg:text-[24px] lg:leading-tight">
        Metas do Bimestre
      </h2>

      {metas.length === 0 ? (
        <p className="py-3 text-center font-(family-name:--font-poppins) text-xs text-secondary">
          Nenhuma meta definida para este bimestre.
        </p>
      ) : (
        <div className="flex max-h-[176px] flex-col gap-2 overflow-y-auto pr-2">
          {metas.map((meta) => {
            const badge = CONFIG_STATUS_META[meta.status] ?? CONFIG_STATUS_META.em_progresso;
            return (
              <div
                key={meta.id}
                className="flex min-h-[64px] shrink-0 flex-col items-start justify-center gap-1.5 rounded-[20px] bg-surface-muted px-3.5 py-2"
              >
                <p className="font-(family-name:--font-poppins) text-xs leading-snug text-secondary sm:text-sm lg:text-[14px]">
                  {meta.titulo}
                </p>
                <span
                  className={`inline-flex h-[23px] items-center justify-center rounded-full px-5 font-(family-name:--font-poppins) text-[11px] font-bold ${badge.classe}`}
                >
                  {badge.rotulo}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
