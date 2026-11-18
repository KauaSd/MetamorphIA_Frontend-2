"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, ChevronLeft } from "lucide-react";
import Input from "@/components/common/Input";
import DropDown, { type DropDownOption } from "@/components/common/DropDown";
import CheckBox from "@/components/common/CheckBox";
import Button from "@/components/common/Button";
import { UFS_BRASIL, buscarMunicipiosPorUf } from "@/utils/localidades";
import { BENEFICIOS_PRO } from "@/components/public/Planos";

type Periodicidade = "mensal" | "anual";

const OPCOES_PERIODICIDADE: Record<
  Periodicidade,
  {
    titulo: string;
    resumo: string;
    valor: string;
    preco: string;
    unidade: string;
  }
> = {
  mensal: {
    titulo: "Mensal",
    resumo: "Pro mensal",
    valor: "R$ 40,90",
    preco: "R$40,90/mês",
    unidade: "mês",
  },
  anual: {
    titulo: "Anual",
    resumo: "Pro anual",
    valor: "R$ 490,80",
    preco: "R$490,80/ano",
    unidade: "ano",
  },
};

function calcularDataRenovacao(periodicidade: Periodicidade): string {
  const data = new Date();
  if (periodicidade === "mensal") {
    data.setMonth(data.getMonth() + 1);
  } else {
    data.setFullYear(data.getFullYear() + 1);
  }
  return new Intl.DateTimeFormat("pt-BR").format(data);
}

function formatarData(valor: string): string {
  const digitos = valor.replace(/\D/g, "").slice(0, 8);
  if (digitos.length <= 2) return digitos;
  if (digitos.length <= 4) return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
  return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
}

function paraIsoData(dataBr: string): string {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(dataBr);
  if (!match) return "";
  return `${match[3]}-${match[2]}-${match[1]}`;
}

export default function ComprarPlanoPage() {
  const router = useRouter();
  const datePickerRef = useRef<HTMLInputElement>(null);
  const [periodicidade, setPeriodicidade] = useState<Periodicidade>("mensal");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [uf, setUf] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [municipios, setMunicipios] = useState<DropDownOption[]>([]);
  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [cienteRenovacao, setCienteRenovacao] = useState(false);
  const [etapaPagamento, setEtapaPagamento] = useState<
    "idle" | "aguardando" | "concluido"
  >("idle");

  // shortcut: mock temporizado de pagamento até integrar o gateway real
  useEffect(() => {
    if (etapaPagamento === "aguardando") {
      const timer = setTimeout(() => setEtapaPagamento("concluido"), 2500);
      return () => clearTimeout(timer);
    }
    if (etapaPagamento === "concluido") {
      const timer = setTimeout(() => {
        sessionStorage.setItem("metamorphia:boasVindasPro", "1");
        router.push("/escolas");
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [etapaPagamento, router]);

  const planoSelecionado = OPCOES_PERIODICIDADE[periodicidade];
  const dataRenovacao = calcularDataRenovacao(periodicidade);

  const handleVoltar = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/planos");
    }
  };

  const handleUfChange = (novaUf: string) => {
    setUf(novaUf);
    setMunicipio("");
    if (!novaUf) {
      setMunicipios([]);
      return;
    }
    buscarMunicipiosPorUf(novaUf)
      .then((lista) => setMunicipios(lista))
      .catch(() => setMunicipios([]));
  };

  return (
    <div className="flex h-full w-full items-center justify-center bg-surface-muted px-10 max-lg:h-auto max-lg:px-4 max-lg:py-8">
      <div className="flex w-full max-w-[1655px] items-start justify-center gap-10 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:max-w-[1324px] [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:gap-8 [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:max-w-[1125px] [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:gap-6 max-lg:flex-col max-lg:items-center max-lg:gap-6">
        <div className="flex h-[790px] max-w-[866px] flex-[866] flex-col rounded-[50px] bg-surface-base p-10 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:h-[632px] [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:max-w-[693px] [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:rounded-[40px] [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:p-8 [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:h-[545px] [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:max-w-[589px] [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:rounded-[34px] [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:p-6 max-lg:h-auto max-lg:w-full max-lg:max-w-[520px] max-lg:flex-none max-lg:rounded-[32px] max-lg:p-5 sm:max-lg:p-7">
        <div className="flex items-start gap-6 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:gap-5 [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:gap-4 max-lg:gap-2.5">
          <button
            type="button"
            aria-label="Voltar"
            onClick={handleVoltar}
            className="cursor-pointer text-primary transition-colors hover:text-secondary"
          >
            <ChevronLeft className="h-6 w-6 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:h-5 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:w-5 max-lg:h-5 max-lg:w-5" />
          </button>

          <div className="mt-2 flex min-w-0 flex-1 flex-col gap-10 pr-12 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:mt-1.5 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:gap-8 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:pr-10 [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:mt-1 [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:gap-5 [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:pr-7 max-lg:mt-0.5 max-lg:gap-5 max-lg:pr-0">
            <div className="flex flex-col gap-2 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:gap-1.5 [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:gap-1 max-lg:gap-1">
              <div className="h-fit w-fit rounded-3xl bg-surface-accent/50 px-3 py-1 text-xs [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:px-2.5 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:py-0.5 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:text-[11px] max-lg:px-2.5 max-lg:py-0.5 max-lg:text-[11px]">
                <span className="font-bold text-ink">PRO</span>
              </div>
              <p className="text-sm text-secondary [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:text-xs max-lg:text-xs">
                Configure seu plano individual
              </p>
            </div>

            <div className="flex gap-12 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:gap-10 [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:gap-7 max-lg:gap-3">
              {(["mensal", "anual"] as const).map((id) => {
                const opcao = OPCOES_PERIODICIDADE[id];
                const selecionado = periodicidade === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPeriodicidade(id)}
                    className={`flex h-[91px] w-[191px] cursor-pointer flex-col items-start justify-center rounded-[30px] border-3 bg-transparent px-5 text-left transition-colors [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:h-[73px] [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:w-[153px] [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:rounded-[24px] [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:px-4 [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:h-[62px] [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:w-[135px] [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:rounded-[20px] [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:px-3.5 max-lg:h-[68px] max-lg:w-auto max-lg:min-w-0 max-lg:flex-1 max-lg:rounded-[22px] max-lg:px-3.5 ${
                      selecionado ? "border-surface-accent" : "border-sunken"
                    }`}
                  >
                    <span className="text-[28px] leading-tight text-primary [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:text-[22px] [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:text-[19px] max-lg:text-[20px]">
                      {opcao.titulo}
                    </span>
                    <span className="text-sm text-secondary [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:text-xs [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:text-[11px] max-lg:text-xs">{opcao.preco}</span>
                  </button>
                );
              })}
            </div>

            <form className="flex w-full flex-col gap-8 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:gap-6 [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:gap-4 max-lg:gap-3.5">
              <Input
                type="text"
                placeholder="Digite seu nome completo"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
                className="px-4 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:py-1.5 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:text-xs [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:py-1 max-lg:py-1.5 max-lg:text-xs"
              />

              <div className="flex flex-row gap-5 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:gap-4 [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:gap-3 max-sm:flex-col max-lg:gap-3.5">
                <Input
                  type="text"
                  placeholder="Digite seu CPF ou CNPJ"
                  value={cpfCnpj}
                  onChange={(e) => setCpfCnpj(e.target.value)}
                  className="px-4 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:py-1.5 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:text-xs [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:py-1 max-lg:py-1.5 max-lg:text-xs"
                />
                <div className="relative w-full">
                  <Input
                    type="text"
                    placeholder="Digite sua data de nasc."
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(formatarData(e.target.value))}
                    className="px-4 pr-10 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:py-1.5 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:text-xs [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:py-1 max-lg:py-1.5 max-lg:text-xs"
                  />
                  <button
                    type="button"
                    aria-label="Abrir calendário"
                    onClick={() => {
                      const picker = datePickerRef.current;
                      if (!picker) return;
                      if (typeof picker.showPicker === "function") {
                        picker.showPicker();
                      } else {
                        picker.click();
                      }
                    }}
                    className="absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer text-secondary transition-colors hover:text-primary"
                  >
                    <Calendar className="h-4 w-4" />
                  </button>
                  <input
                    ref={datePickerRef}
                    type="date"
                    tabIndex={-1}
                    aria-hidden="true"
                    value={paraIsoData(dataNascimento)}
                    onChange={(e) => {
                      const [ano, mes, dia] = e.target.value.split("-");
                      if (ano && mes && dia) {
                        setDataNascimento(`${dia}/${mes}/${ano}`);
                      }
                    }}
                    className="pointer-events-none absolute right-0 bottom-0 h-0 w-0 opacity-0"
                  />
                </div>
              </div>

              <div className="flex flex-row items-center gap-4 max-lg:gap-3">
                <DropDown
                  small
                  options={UFS_BRASIL}
                  value={uf}
                  onChange={handleUfChange}
                  placeholder="UF"
                  maxVisibleItems={6}
                  font="poppins"
                  textSize="text-sm"
                  className="[@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:h-7.5 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:text-xs [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:h-7 max-lg:h-8 max-lg:text-xs"
                />
                <div className="w-60 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:w-52 [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:w-44 max-lg:min-w-0 max-lg:w-auto max-lg:flex-1">
                  <DropDown
                    options={municipios}
                    value={municipio}
                    onChange={setMunicipio}
                    placeholder="Município"
                    disabled={!uf}
                    maxVisibleItems={6}
                    font="poppins"
                    textSize="text-sm"
                    className="[@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:h-8 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:text-xs [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:h-7 max-lg:h-8 max-lg:text-xs"
                  />
                </div>
              </div>
            </form>

            <div className="h-[2px] w-full bg-sunken" />

            <div className="flex flex-col gap-3 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:gap-2.5 [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:gap-1.5 max-lg:gap-2">
              {BENEFICIOS_PRO.map((beneficio, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-surface-accent [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:h-3.5 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:w-3.5 max-lg:h-3.5 max-lg:w-3.5" />
                  <span className="text-[14px] leading-5 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:text-xs [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:leading-4 [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:text-[11px] max-lg:text-xs max-lg:leading-4">{beneficio}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

        <div className="flex h-[472px] max-w-[749px] flex-[749] flex-col rounded-[50px] bg-surface-base px-[55px] py-13 gap-3 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:h-[378px] [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:max-w-[599px] [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:rounded-[40px] [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:px-[44px] [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:py-10 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:gap-2.5 [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:h-[330px] [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:max-w-[509px] [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:rounded-[34px] [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:px-8 [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:py-7 max-lg:h-auto max-lg:w-full max-lg:max-w-[520px] max-lg:flex-none max-lg:rounded-[32px] max-lg:px-5 max-lg:py-6 sm:max-lg:px-8">
          <div className="flex flex-col gap-3 text-sm text-primary [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:gap-2.5 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:text-xs [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:gap-1.5 max-lg:gap-2 max-lg:text-xs">
            <div className="flex items-end justify-between">
              <span>{planoSelecionado.resumo}</span>
              <span>{planoSelecionado.valor}</span>
            </div>
            <div className="flex items-end justify-between font-bold">
              <span>Total a pagar hoje</span>
              <span>{planoSelecionado.valor}</span>
            </div>
          </div>

          <div className="mt-5 flex h-[88px] w-full max-w-[639px] items-center rounded-[20px] bg-sunken px-6 text-sm text-secondary [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:mt-4 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:h-[70px] [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:px-5 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:text-xs [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:mt-2.5 [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:h-[60px] max-lg:mt-3 max-lg:h-auto max-lg:min-h-[64px] max-lg:px-4 max-lg:py-3 max-lg:text-xs">
            <p>
              Sua assinatura será renovada automaticamente em {dataRenovacao}. O
              valor cobrado será {planoSelecionado.preco}.
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-3 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:mt-4 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:gap-2.5 [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:mt-2.5 [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:gap-1.5 max-lg:mt-3 max-lg:gap-2">
            <CheckBox checked={aceitaTermos} onChange={setAceitaTermos} />
            <CheckBox checked={cienteRenovacao} onChange={setCienteRenovacao}>
              Estou ciente de que meu plano Pro renova automaticamente a cada{" "}
              {planoSelecionado.unidade} e que posso cancelar quando quiser, em
              Configurações &gt; Planos.
            </CheckBox>
          </div>

          <div className="mt-8 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:mt-6 [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:mt-3 max-lg:mt-4">
            <Button
              type="button"
              disabled={!aceitaTermos || !cienteRenovacao || etapaPagamento !== "idle"}
              onClick={() => setEtapaPagamento("aguardando")}
              className="font-(family-name:--font-poppins) text-base sm:text-base text-ink [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:py-1.5 [@media(min-width:1024px)_and_(max-width:1700px),(min-width:1024px)_and_(max-height:850px)]:text-sm [@media(min-width:1024px)_and_(max-width:1380px),(min-width:1024px)_and_(max-height:680px)]:py-1 max-lg:py-1.5 max-lg:text-sm"
            >
              Assinar
            </Button>
          </div>
        </div>
      </div>

      {etapaPagamento !== "idle" && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={
            etapaPagamento === "aguardando"
              ? "Aguardando pagamento"
              : "Pagamento concluído"
          }
          className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-inverse/45 px-4"
        >
          <div className="flex h-[385px] w-full max-w-[450px] flex-col items-center justify-center gap-8 rounded-[50px] bg-surface-base p-8 shadow-lg max-sm:h-[320px] max-sm:max-w-[340px] max-sm:gap-6 max-sm:rounded-[38px]">
            <p className="text-center font-(family-name:--font-poppins) text-[22px] text-primary max-sm:text-lg">
              {etapaPagamento === "aguardando"
                ? "Aguardando pagamento..."
                : "Pagamento concluído!"}
            </p>

            {etapaPagamento === "aguardando" ? (
              <div className="flex h-[168px] w-[168px] items-center justify-center rounded-full bg-surface-accent max-sm:h-32 max-sm:w-32">
                <svg
                  className="h-24 w-24 animate-spin text-inverse max-sm:h-18 max-sm:w-18"
                  viewBox="0 0 50 50"
                  aria-hidden="true"
                >
                  <circle
                    className="opacity-30"
                    cx="25"
                    cy="25"
                    r="19"
                    stroke="currentColor"
                    strokeWidth="5"
                    fill="none"
                  />
                  <circle
                    cx="25"
                    cy="25"
                    r="19"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeDasharray="36 120"
                    fill="none"
                  />
                </svg>
              </div>
            ) : (
              <div className="flex h-[168px] w-[168px] items-center justify-center rounded-full bg-surface-success max-sm:h-32 max-sm:w-32">
                <svg
                  className="h-24 w-24 text-inverse max-sm:h-18 max-sm:w-18"
                  viewBox="0 0 50 50"
                  aria-hidden="true"
                >
                  <path
                    d="M14 26L22 34L37 17"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
