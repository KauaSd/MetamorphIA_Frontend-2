"use client";

import { type ReactNode, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft } from "lucide-react";
import Button from "@/components/common/Button";
import DropDown, { type DropDownOption } from "@/components/common/DropDown";
import Input from "@/components/common/Input";
import { useData } from "@/components/app/state/DataProvider";

type TamanhoInstituicao = "1-escola" | "2-ou-mais";

const OPCOES_TAMANHO: Record<
  TamanhoInstituicao,
  { titulo: string; subtitulo: string }
> = {
  "1-escola": {
    titulo: "1 escola",
    subtitulo: "Institucional",
  },
  "2-ou-mais": {
    titulo: "2 ou mais",
    subtitulo: "Institucional+",
  },
};

const BENEFICIOS_INSTITUCIONAL: ReactNode[] = [
  <>
    <b className="font-semibold text-primary">Todos os recursos</b> do plano
    <br />
    Pro para todos os docentes
  </>,
  <>
    <b className="font-semibold text-primary">
      Painel de coordenação e métricas
      <br />
      institucionais
    </b>
  </>,
  <>
    Os professores conseguem compartilhar alunos e
    <br />
    turmas
  </>,
];

export default function InstitucionalPage() {
  const router = useRouter();
  const { escolas: escolasData } = useData();
  const [tamanho, setTamanho] = useState<TamanhoInstituicao>("1-escola");
  const [escolaId, setEscolaId] = useState("");
  const [etapa, setEtapa] = useState<"tamanho" | "fale-conosco">("tamanho");
  const [email, setEmail] = useState("");

  const opcoesEscolas: DropDownOption[] = useMemo(
    () => (escolasData ?? []).map((e) => ({ value: e.id, label: e.nome })),
    [escolasData]
  );

  const handleVoltar = () => {
    if (etapa === "fale-conosco") {
      setEtapa("tamanho");
      return;
    }
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/planos");
    }
  };

  const handleContinuar = () => {
    if (tamanho === "2-ou-mais") {
      setEtapa("fale-conosco");
    }
  };

  return (
    <div className="flex h-auto w-full items-center justify-center bg-surface-muted px-4 py-8 lg:h-full lg:px-10 lg:py-0">
      <div className="flex w-full max-w-[560px] flex-col rounded-[32px] bg-surface-base p-5 sm:p-7 lg:max-w-[480px] lg:rounded-[34px] lg:p-6 xl:max-w-[520px] xl:rounded-[40px] xl:p-8 2xl:max-w-[560px] 2xl:rounded-[50px] 2xl:p-10">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Voltar"
            onClick={handleVoltar}
            className="cursor-pointer text-primary transition-colors hover:text-secondary"
          >
            <ChevronLeft className="h-5 w-5 2xl:h-6 2xl:w-6" />
          </button>
          <div className="h-fit w-fit rounded-3xl bg-surface-warning px-2.5 py-0.5 text-[11px] 2xl:px-3 2xl:py-1 2xl:text-xs">
            <span className="font-bold text-ink">
              {etapa === "fale-conosco" ? "INSTITUCIONAL+" : "INSTITUCIONAL"}
            </span>
          </div>
        </div>

        {etapa === "tamanho" ? (
          <>
            <div className="mt-6 flex flex-col items-center justify-center gap-2.5 lg:mt-4 xl:mt-6 2xl:mt-8">
              <h1 className="text-center text-[22px] leading-snug text-primary lg:text-[20px] xl:text-[24px] 2xl:text-[28px]">
                Qual o tamanho
                <br />
                da sua instituição?
              </h1>
              <span className="text-center text-xs text-secondary 2xl:text-sm">
                Vamos ajustar o plano ao tamanho da sua rede.
              </span>
            </div>

            <div className="mx-auto mt-6 flex w-full max-w-[422px] flex-col gap-5 lg:mt-5 lg:gap-4 xl:mt-7 xl:gap-5 2xl:mt-9 2xl:gap-7">
              <div className="flex items-center justify-between gap-3 lg:gap-4 xl:gap-6 2xl:gap-10">
                {(["1-escola", "2-ou-mais"] as const).map((id) => {
                  const opcao = OPCOES_TAMANHO[id];
                  const selecionado = tamanho === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setTamanho(id)}
                      className={`flex h-[72px] min-w-0 flex-1 cursor-pointer flex-col items-start justify-center rounded-[22px] border-3 bg-transparent px-3.5 text-left transition-colors lg:h-[66px] lg:rounded-[20px] xl:h-[78px] xl:rounded-[24px] xl:px-4 2xl:h-[91px] 2xl:w-[191px] 2xl:flex-none 2xl:rounded-[30px] 2xl:px-5 ${
                        selecionado ? "border-surface-warning" : "border-sunken"
                      }`}
                    >
                      <span className="text-[20px] leading-tight text-primary lg:text-[19px] xl:text-[22px] 2xl:text-[28px]">
                        {opcao.titulo}
                      </span>
                      <span className="text-xs text-secondary lg:text-[11px] xl:text-xs 2xl:text-sm">
                        {opcao.subtitulo}
                      </span>
                    </button>
                  );
                })}
              </div>

              <DropDown
                options={opcoesEscolas}
                value={escolaId}
                onChange={setEscolaId}
                placeholder="Selecione sua escola"
                font="poppins"
                textSize="text-sm"
                maxVisibleItems={5}
                className={`h-9 text-xs lg:h-8 xl:h-9 2xl:h-10 2xl:text-sm ${
                  escolaId ? "text-primary" : "text-secondary"
                }`}
              />
            </div>

            <div className="my-6 h-[2px] w-full bg-sunken lg:my-4 xl:my-6 2xl:my-8" />

            <div className="mx-auto flex w-full max-w-[422px] flex-col gap-6 lg:gap-4 xl:gap-6 2xl:gap-8">
              <div className="flex flex-col gap-2.5 lg:gap-2 xl:gap-3 2xl:gap-3.5">
                {BENEFICIOS_INSTITUCIONAL.map((beneficio, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-surface-warning/35 2xl:h-5 2xl:w-5">
                      <Check
                        className="h-2.5 w-2.5 text-surface-warning-strong 2xl:h-3 2xl:w-3"
                        strokeWidth={2.5}
                      />
                    </div>
                    <span className="text-xs leading-4 text-secondary lg:text-[11px] xl:text-xs 2xl:text-[13px] 2xl:leading-5">
                      {beneficio}
                    </span>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="warning"
                onClick={handleContinuar}
                className="py-2 font-(family-name:--font-poppins) text-xs lg:py-1.5 xl:py-2 2xl:py-2.5 2xl:text-sm"
              >
                Continuar
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="mt-6 flex flex-col items-center justify-center gap-2 lg:mt-4 xl:mt-6 2xl:mt-8">
              <h1 className="text-center text-[22px] leading-snug text-primary lg:text-[20px] xl:text-[24px] 2xl:text-[28px]">
                Fale conosco
              </h1>
              <span className="text-center text-xs text-secondary 2xl:text-sm">
                Vamos montar a melhor solução para o seu time.
              </span>
            </div>

            <div className="mx-auto mt-6 flex w-full max-w-[422px] flex-col gap-5 lg:mt-5 lg:gap-4 xl:mt-7 xl:gap-5 2xl:mt-9 2xl:gap-7">
              <Input
                type="email"
                placeholder="Digite seu e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-9 px-5 text-xs text-primary placeholder:text-secondary lg:h-8 xl:h-9 2xl:h-10 2xl:text-sm"
              />

              <div className="flex flex-col gap-3 text-justify text-xs leading-4 text-secondary lg:text-[11px] xl:text-xs 2xl:gap-4 2xl:text-[13px] 2xl:leading-5">
                <p>
                  Suas necessidades vão além do limite do plano Institucional.
                  Para isso, temos o Institucional+! Deixe seu e-mail e
                  entraremos em contato para montarmos juntos uma solução para
                  as suas escolas.
                </p>
                <p>Retornamos em até 5 dias.</p>
              </div>

              <Button
                type="button"
                variant="warning"
                className="mt-1 py-2 font-(family-name:--font-poppins) text-xs lg:py-1.5 xl:py-2 2xl:py-2.5 2xl:text-sm"
              >
                Enviar
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
