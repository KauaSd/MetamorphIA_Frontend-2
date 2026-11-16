"use client";

import { useRef, useState } from "react";
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
    <div className="flex h-full w-full items-center justify-center bg-surface-muted px-10">
      <div className="flex w-full max-w-[1655px] items-start justify-center gap-10">
        <div className="flex h-[790px] max-w-[866px] flex-[866] flex-col rounded-[50px] bg-surface-base p-10">
        <div className="flex items-start gap-6">
          <button
            type="button"
            aria-label="Voltar"
            onClick={handleVoltar}
            className="cursor-pointer text-primary transition-colors hover:text-secondary"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="mt-2 flex flex-1 flex-col gap-10 pr-12">
            <div className="flex flex-col gap-2">
              <div className="h-fit w-fit rounded-3xl bg-surface-accent/50 px-3 py-1 text-xs">
                <span className="font-bold text-ink">PRO</span>
              </div>
              <p className="text-sm text-secondary">
                Configure seu plano individual
              </p>
            </div>

            <div className="flex gap-12">
              {(["mensal", "anual"] as const).map((id) => {
                const opcao = OPCOES_PERIODICIDADE[id];
                const selecionado = periodicidade === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPeriodicidade(id)}
                    className={`flex h-[91px] w-[191px] cursor-pointer flex-col items-start justify-center rounded-[30px] border-3 bg-transparent px-5 text-left transition-colors ${
                      selecionado ? "border-surface-accent" : "border-sunken"
                    }`}
                  >
                    <span className="text-[28px] leading-tight text-primary">
                      {opcao.titulo}
                    </span>
                    <span className="text-sm text-secondary">{opcao.preco}</span>
                  </button>
                );
              })}
            </div>

            <form className="flex w-full flex-col gap-8">
              <Input
                type="text"
                placeholder="Digite seu nome completo"
                value={nomeCompleto}
                onChange={(e) => setNomeCompleto(e.target.value)}
                className="px-4"
              />

              <div className="flex flex-row gap-5">
                <Input
                  type="text"
                  placeholder="Digite seu CPF ou CNPJ"
                  value={cpfCnpj}
                  onChange={(e) => setCpfCnpj(e.target.value)}
                  className="px-4"
                />
                <div className="relative w-full">
                  <Input
                    type="text"
                    placeholder="Digite sua data de nasc."
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(formatarData(e.target.value))}
                    className="px-4 pr-10"
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

              <div className="flex flex-row items-center gap-4">
                <DropDown
                  small
                  options={UFS_BRASIL}
                  value={uf}
                  onChange={handleUfChange}
                  placeholder="UF"
                  maxVisibleItems={6}
                  font="poppins"
                  textSize="text-sm"
                />
                <div className="w-60">
                  <DropDown
                    options={municipios}
                    value={municipio}
                    onChange={setMunicipio}
                    placeholder="Município"
                    disabled={!uf}
                    maxVisibleItems={6}
                    font="poppins"
                    textSize="text-sm"
                  />
                </div>
              </div>
            </form>

            <div className="h-[2px] w-full bg-sunken" />

            <div className="flex flex-col gap-3">
              {BENEFICIOS_PRO.map((beneficio, i) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="mt-0.5 h-4 w-4 shrink-0 rounded-full bg-surface-accent" />
                  <span className="text-[14px] leading-5">{beneficio}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

        <div className="flex h-[472px] max-w-[749px] flex-[749] flex-col rounded-[50px] bg-surface-base px-[55px] py-13 gap-3">
          <div className="flex flex-col gap-3 text-sm text-primary">
            <div className="flex items-end justify-between">
              <span>{planoSelecionado.resumo}</span>
              <span>{planoSelecionado.valor}</span>
            </div>
            <div className="flex items-end justify-between font-bold">
              <span>Total a pagar hoje</span>
              <span>{planoSelecionado.valor}</span>
            </div>
          </div>

          <div className="mt-5 flex h-[88px] w-full max-w-[639px] items-center rounded-[20px] bg-sunken px-6 text-sm text-secondary">
            <p>
              Sua assinatura será renovada automaticamente em {dataRenovacao}. O
              valor cobrado será {planoSelecionado.preco}.
            </p>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            <CheckBox checked={aceitaTermos} onChange={setAceitaTermos} />
            <CheckBox checked={cienteRenovacao} onChange={setCienteRenovacao}>
              Estou ciente de que meu plano Pro renova automaticamente a cada{" "}
              {planoSelecionado.unidade} e que posso cancelar quando quiser, em
              Configurações &gt; Planos.
            </CheckBox>
          </div>

          <div className="mt-8">
            <Button
              type="button"
              disabled={!aceitaTermos || !cienteRenovacao}
              className="font-(family-name:--font-poppins) text-base sm:text-base text-ink"
            >
              Assinar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
