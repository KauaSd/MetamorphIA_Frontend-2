"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, ChevronLeft } from "lucide-react";
import Input from "@/components/common/Input";
import DropDown, { type DropDownOption } from "@/components/common/DropDown";
import CheckBox from "@/components/common/CheckBox";
import Button from "@/components/common/Button";
import { BarraCarregando } from "@/components/common/Carregando";
import Toast, { useAlerta } from "@/components/common/Toast";
import { UFS_BRASIL, buscarMunicipiosPorUf } from "@/utils/localidades";
import { BENEFICIOS_PRO } from "@/components/public/Planos";
import {
  apiDbFetch,
  getAuthToken,
  getSavedUserProfile,
  setSavedUserProfile,
  type UserProfile,
} from "@/utils/apiClient";

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
  const [carregandoMunicipios, setCarregandoMunicipios] = useState(false);
  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [cienteRenovacao, setCienteRenovacao] = useState(false);
  const [etapaPagamento, setEtapaPagamento] = useState<
    "idle" | "aguardando" | "concluido"
  >(() => {
    if (typeof window === "undefined") return "idle";
    const params = new URLSearchParams(window.location.search);
    const statusRetorno = (
      params.get("status") ??
      params.get("collection_status") ??
      ""
    ).toLowerCase();
    return statusRetorno === "approved" ? "aguardando" : "idle";
  });
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const { alerta, mostrar, limpar } = useAlerta();

  function mostrarErro(descricao: string) {
    mostrar({ tom: "danger", titulo: "Não foi possível continuar", descricao });
  }

  async function verificarPlanoAtivo(): Promise<boolean> {
    if (!getAuthToken()) return false;
    try {
      const resp = await apiDbFetch("/autenticar/perfil");
      if (!resp.ok) return false;
      const perfil = (await resp.json()) as UserProfile;
      const salvo = getSavedUserProfile();
      setSavedUserProfile({ ...(salvo ?? {}), ...perfil });
      return (perfil.plano ?? "").trim().toLowerCase() === "pro";
    } catch {
      return false;
    }
  }

  async function iniciarAssinatura() {
    if (!getAuthToken()) {
      mostrarErro("Faça login para assinar o plano Pro.");
      return;
    }

    const docDigitos = cpfCnpj.replace(/\D/g, "");
    if (docDigitos.length !== 11 && docDigitos.length !== 14) {
      mostrarErro("Informe um CPF ou CNPJ válido para continuar.");
      return;
    }

    setEtapaPagamento("aguardando");
    setCheckoutUrl(null);
    try {
      const tipoCont = docDigitos.length === 14 ? "cnpj" : "cpf";
      const resp = await apiDbFetch("/pagamentos/checkout", {
        method: "POST",
        body: JSON.stringify({
          nome_plano: "pro",
          tipo_cont: tipoCont,
          documento_cont: docDigitos,
        }),
      });
      if (!resp.ok) {
        const erroBody = (await resp.json().catch(() => null)) as
          | { detail?: string; message?: string; erro?: string }
          | null;
        setEtapaPagamento("idle");
        mostrarErro(
          erroBody?.detail ??
            erroBody?.message ??
            erroBody?.erro ??
            "Não foi possível iniciar o pagamento no Mercado Pago."
        );
        return;
      }

      const dados = (await resp.json()) as {
        checkout_url?: string;
        init_point?: string;
        sandbox_init_point?: string;
        url?: string;
      };
      const urlDestino =
        dados.checkout_url ??
        dados.init_point ??
        dados.sandbox_init_point ??
        dados.url;
      if (!urlDestino || !urlDestino.startsWith("http")) {
        setEtapaPagamento("idle");
        mostrarErro("Link de pagamento do Mercado Pago não recebido.");
        return;
      }

      setCheckoutUrl(urlDestino);
      window.location.assign(urlDestino);
    } catch {
      setEtapaPagamento("idle");
      mostrarErro("Erro ao conectar com o serviço de pagamentos.");
    }
  }

  useEffect(() => {
    if (etapaPagamento === "aguardando") {
      let ativo = true;
      const checar = async () => {
        const virouPro = await verificarPlanoAtivo();
        if (ativo && virouPro) {
          setEtapaPagamento("concluido");
        }
      };
      void checar();
      const intervalo = setInterval(() => {
        void checar();
      }, 3000);
      return () => {
        ativo = false;
        clearInterval(intervalo);
      };
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
      setCarregandoMunicipios(false);
      return;
    }
    setCarregandoMunicipios(true);
    buscarMunicipiosPorUf(novaUf)
      .then((lista) => setMunicipios(lista))
      .catch(() => setMunicipios([]))
      .finally(() => setCarregandoMunicipios(false));
  };

  return (
    <div className="flex h-auto w-full items-center justify-center bg-surface-muted px-4 py-8 lg:h-full lg:px-10 lg:py-0">
      <div className="flex w-full flex-col items-center justify-center gap-6 lg:max-w-[1125px] lg:flex-row lg:items-start xl:max-w-[1324px] xl:gap-8 2xl:max-w-[1655px] 2xl:gap-10">
        <div className="flex w-full max-w-[520px] flex-col rounded-[32px] bg-surface-base p-5 sm:p-7 lg:h-[545px] lg:max-w-[589px] lg:flex-[866] lg:rounded-[34px] lg:p-6 xl:h-[632px] xl:max-w-[693px] xl:rounded-[40px] xl:p-8 2xl:h-[790px] 2xl:max-w-[866px] 2xl:rounded-[50px] 2xl:p-10">
          <div className="flex items-start gap-2.5 lg:gap-4 xl:gap-5 2xl:gap-6">
            <button
              type="button"
              aria-label="Voltar"
              onClick={handleVoltar}
              className="cursor-pointer text-primary transition-colors hover:text-secondary"
            >
              <ChevronLeft className="h-5 w-5 2xl:h-6 2xl:w-6" />
            </button>

            <div className="mt-0.5 flex min-w-0 flex-1 flex-col gap-5 lg:mt-1 lg:pr-7 xl:mt-1.5 xl:gap-8 xl:pr-10 2xl:mt-2 2xl:gap-10 2xl:pr-12">
              <div className="flex flex-col gap-1 xl:gap-1.5 2xl:gap-2">
                <div className="h-fit w-fit rounded-3xl bg-surface-accent/50 px-2.5 py-0.5 text-[11px] 2xl:px-3 2xl:py-1 2xl:text-xs">
                  <span className="font-bold text-ink">PRO</span>
                </div>
                <p className="text-xs text-secondary 2xl:text-sm">
                  Configure seu plano individual
                </p>
              </div>

              <div className="flex gap-3 lg:gap-7 xl:gap-10 2xl:gap-12">
                {(["mensal", "anual"] as const).map((id) => {
                  const opcao = OPCOES_PERIODICIDADE[id];
                  const selecionado = periodicidade === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPeriodicidade(id)}
                      className={`flex h-[68px] min-w-0 flex-1 cursor-pointer flex-col items-start justify-center rounded-[22px] border-3 bg-transparent px-3.5 text-left transition-colors lg:h-[62px] lg:w-[135px] lg:flex-none lg:rounded-[20px] xl:h-[73px] xl:w-[153px] xl:rounded-[24px] xl:px-4 2xl:h-[91px] 2xl:w-[191px] 2xl:rounded-[30px] 2xl:px-5 ${
                        selecionado ? "border-surface-accent" : "border-sunken"
                      }`}
                    >
                      <span className="text-[20px] leading-tight text-primary lg:text-[19px] xl:text-[22px] 2xl:text-[28px]">
                        {opcao.titulo}
                      </span>
                      <span className="text-xs text-secondary lg:text-[11px] xl:text-xs 2xl:text-sm">
                        {opcao.preco}
                      </span>
                    </button>
                  );
                })}
              </div>

              <form className="flex w-full flex-col gap-3.5 lg:gap-4 xl:gap-6 2xl:gap-8">
                <Input
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={nomeCompleto}
                  onChange={(e) => setNomeCompleto(e.target.value)}
                  className="px-4 py-1.5 text-xs lg:py-1 xl:py-1.5 2xl:py-[0.55rem] 2xl:text-sm"
                />

                <div className="flex flex-col gap-3.5 sm:flex-row lg:gap-3 xl:gap-4 2xl:gap-5">
                  <Input
                    type="text"
                    placeholder="Digite seu CPF ou CNPJ"
                    value={cpfCnpj}
                    onChange={(e) => setCpfCnpj(e.target.value)}
                    className="px-4 py-1.5 text-xs lg:py-1 xl:py-1.5 2xl:py-[0.55rem] 2xl:text-sm"
                  />
                  <div className="relative w-full">
                    <Input
                      type="text"
                      placeholder="Digite sua data de nasc."
                      value={dataNascimento}
                      onChange={(e) =>
                        setDataNascimento(formatarData(e.target.value))
                      }
                      className="px-4 py-1.5 pr-10 text-xs lg:py-1 xl:py-1.5 2xl:py-[0.55rem] 2xl:text-sm"
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

                <div className="flex flex-row items-center gap-3 lg:gap-4">
                  <DropDown
                    small
                    options={UFS_BRASIL}
                    value={uf}
                    onChange={handleUfChange}
                    placeholder="UF"
                    maxVisibleItems={6}
                    font="poppins"
                    textSize="text-sm"
                    className="h-8 text-xs lg:h-7 xl:h-7.5 2xl:h-8 2xl:text-sm"
                  />
                  <div className="min-w-0 flex-1 lg:w-44 lg:flex-none xl:w-52 2xl:w-60">
                    <DropDown
                      options={municipios}
                      value={municipio}
                      onChange={setMunicipio}
                      placeholder={carregandoMunicipios ? "Carregando..." : "Município"}
                      disabled={!uf || carregandoMunicipios}
                      maxVisibleItems={6}
                      font="poppins"
                      textSize="text-sm"
                      className="h-8 text-xs lg:h-7 xl:h-8 2xl:h-9 2xl:text-sm"
                    />
                  </div>
                </div>
              </form>

              <div className="h-[2px] w-full bg-sunken" />

              <div className="flex flex-col gap-2 lg:gap-1.5 xl:gap-2.5 2xl:gap-3">
                {BENEFICIOS_PRO.map((beneficio, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full bg-surface-accent 2xl:h-4 2xl:w-4" />
                    <span className="text-xs leading-4 lg:text-[11px] xl:text-xs 2xl:text-[14px] 2xl:leading-5">
                      {beneficio}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full max-w-[520px] flex-col gap-3 rounded-[32px] bg-surface-base px-5 py-6 sm:px-8 lg:h-[330px] lg:max-w-[509px] lg:flex-[749] lg:rounded-[34px] lg:px-8 lg:py-7 xl:h-[378px] xl:max-w-[599px] xl:gap-2.5 xl:rounded-[40px] xl:px-[44px] xl:py-10 2xl:h-[472px] 2xl:max-w-[749px] 2xl:gap-3 2xl:rounded-[50px] 2xl:px-[55px] 2xl:py-13">
          <div className="flex flex-col gap-2 text-xs text-primary lg:gap-1.5 xl:gap-2.5 2xl:gap-3 2xl:text-sm">
            <div className="flex items-end justify-between">
              <span>{planoSelecionado.resumo}</span>
              <span>{planoSelecionado.valor}</span>
            </div>
            <div className="flex items-end justify-between font-bold">
              <span>Total a pagar hoje</span>
              <span>{planoSelecionado.valor}</span>
            </div>
          </div>

          <div className="mt-3 flex min-h-[64px] w-full max-w-[639px] items-center rounded-[20px] bg-sunken px-4 py-3 text-xs text-secondary lg:mt-2.5 lg:h-[60px] lg:min-h-0 lg:py-0 xl:mt-4 xl:h-[70px] xl:px-5 2xl:mt-5 2xl:h-[88px] 2xl:px-6 2xl:text-sm">
            <p>
              Sua assinatura será renovada automaticamente em {dataRenovacao}. O
              valor cobrado será {planoSelecionado.preco}.
            </p>
          </div>

          <div className="mt-3 flex flex-col gap-2 lg:mt-2.5 lg:gap-1.5 xl:mt-4 xl:gap-2.5 2xl:mt-5 2xl:gap-3">
            <CheckBox checked={aceitaTermos} onChange={setAceitaTermos} />
            <CheckBox checked={cienteRenovacao} onChange={setCienteRenovacao}>
              Estou ciente de que meu plano Pro renova automaticamente a cada{" "}
              {planoSelecionado.unidade} e que posso cancelar quando quiser, em
              Configurações &gt; Planos.
            </CheckBox>
          </div>

          <div className="mt-4 lg:mt-3 xl:mt-6 2xl:mt-8">
            <Button
              type="button"
              disabled={
                !aceitaTermos || !cienteRenovacao || etapaPagamento !== "idle"
              }
              onClick={() => void iniciarAssinatura()}
              className="py-1.5 font-(family-name:--font-poppins) text-sm text-ink lg:py-1 xl:py-1.5 2xl:py-2 2xl:text-base"
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
          <div className="flex h-[320px] w-full max-w-[340px] flex-col items-center justify-center gap-6 rounded-[38px] bg-surface-base p-8 shadow-lg sm:h-[385px] sm:max-w-[450px] sm:gap-8 sm:rounded-[50px]">
            <p className="text-center font-(family-name:--font-poppins) text-lg text-primary sm:text-[22px]">
              {etapaPagamento === "aguardando"
                ? "Aguardando pagamento..."
                : "Pagamento concluído!"}
            </p>

            {etapaPagamento === "aguardando" ? (
              <div className="flex w-full flex-col items-center justify-center gap-4 py-4">
                <BarraCarregando className="h-2.5 w-56 sm:w-64" />
                <p className="text-center text-xs text-secondary sm:text-sm">
                  Conclua o pagamento na aba do Mercado Pago. Assim que for aprovado, atualizaremos seu plano automaticamente.
                </p>
                {checkoutUrl ? (
                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-medium text-primary underline hover:text-secondary sm:text-sm"
                  >
                    Abrir checkout do Mercado Pago
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    setEtapaPagamento("idle");
                    setCheckoutUrl(null);
                  }}
                  className="mt-1 cursor-pointer text-xs text-secondary underline hover:text-primary"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="flex h-32 w-32 items-center justify-center rounded-full bg-surface-success sm:h-[168px] sm:w-[168px]">
                <svg
                  className="h-18 w-18 text-inverse sm:h-24 sm:w-24"
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
      {alerta ? <Toast alerta={alerta} limpar={limpar} /> : null}
    </div>
  );
}
