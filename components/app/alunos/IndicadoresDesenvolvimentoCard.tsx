import Encaracolado from "@/components/common/Encaracolado";
import EncaracoladoDesenvolvimentoSvg from "@/public/encaracolado_desenvolvimento.svg";
import type { CorIndicador, IndicadorDesenvolvimento } from "@/utils/data/types";

interface IndicadoresDesenvolvimentoCardProps {
  indicadores: IndicadorDesenvolvimento[];
}

const COR_INDICADOR_MAP: Record<CorIndicador, string> = {
  warning: "bg-surface-warning",
  accent: "bg-surface-accent",
  info: "bg-surface-info",
  success: "bg-surface-success",
};

const TOTAL_NIVEIS = 5;

export default function IndicadoresDesenvolvimentoCard({
  indicadores,
}: IndicadoresDesenvolvimentoCardProps) {
  return (
    <div className="relative flex w-full min-w-0 flex-col gap-5 rounded-[50px] bg-surface-base px-6 pt-6 pb-6 sm:px-8 lg:h-[548px] lg:pb-[52px]">
      <Encaracolado
        src={EncaracoladoDesenvolvimentoSvg.src}
        className="absolute left-[-10px] top-1/2 max-h-[90%] w-[26px] -translate-y-1/2 aspect-[36/508] sm:left-[-12px] sm:w-[36px]"
      />

      <div className="flex flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <h2 className="font-(family-name:--font-text-me-one) text-xl text-primary sm:text-2xl min-[1800px]:text-[24px] min-[1800px]:leading-tight">
            Indicadores de Desenvolvimento
          </h2>
          <span className="text-base text-primary" aria-hidden="true">
            ✦
          </span>
        </div>
        <p className="font-(family-name:--font-poppins) text-xs text-secondary sm:text-sm min-[1800px]:text-[14px]">
          Atualizado automaticamente com base nas interações
        </p>
      </div>

      <div className="flex flex-1 flex-col justify-between gap-4">
        {indicadores.map((ind) => {
          const nivel = Math.max(1, Math.min(TOTAL_NIVEIS, ind.nivel));
          const corAtiva = COR_INDICADOR_MAP[ind.cor] ?? COR_INDICADOR_MAP.warning;
          const larguraPreenchida = `${((nivel - 1) / (TOTAL_NIVEIS - 1)) * 100}%`;

          return (
            <div key={ind.id} className="flex w-full min-w-0 flex-col gap-1">
              <p className="font-(family-name:--font-poppins) text-sm font-medium text-primary sm:text-base min-[1800px]:text-[16px]">
                {ind.titulo}
              </p>

              <div className="flex items-center justify-between gap-2 font-(family-name:--font-poppins) text-xs text-secondary sm:text-sm min-[1800px]:text-[14px]">
                <span className="truncate">{ind.escalaEsquerda}</span>
                <span className="truncate">{ind.escalaCentro}</span>
                <span className="truncate">{ind.escalaDireita}</span>
              </div>

              <div
                className="relative flex h-4 w-full items-center justify-between"
                role="progressbar"
                aria-label={ind.titulo}
                aria-valuemin={1}
                aria-valuemax={TOTAL_NIVEIS}
                aria-valuenow={nivel}
              >
                {/* trilha de fundo */}
                <div className="absolute left-0 right-0 h-[5px] rounded-full bg-sunken/60 min-[1800px]:h-[7px]" />
                {/* trilha preenchida */}
                <div
                  className={`absolute left-0 h-[5px] rounded-full transition-all duration-300 min-[1800px]:h-[7px] ${corAtiva}`}
                  style={{ width: larguraPreenchida }}
                />

                {Array.from({ length: TOTAL_NIVEIS }, (_, idx) => {
                  const passo = idx + 1;
                  const ativo = passo <= nivel;
                  return (
                    <span
                      key={passo}
                      className={`relative z-10 h-3.5 w-3.5 rounded-full transition-colors sm:h-4 sm:w-4 ${
                        ativo ? corAtiva : "bg-sunken"
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
