"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Check, ChevronDown, ChevronLeft, ChevronUp } from "lucide-react";
import Button from "@/components/common/Button";
import CheckBox from "@/components/common/CheckBox";
import DropDown, { type DropDownOption } from "@/components/common/DropDown";
import Input from "@/components/common/Input";
import { BarraCarregando } from "@/components/common/Carregando";
import Toast, { useAlerta } from "@/components/common/Toast";
import { useData } from "@/components/app/state/DataProvider";
import { UFS_BRASIL, buscarMunicipiosPorUf } from "@/utils/localidades";
import {
  apiDbFetch,
  getAuthToken,
  getSavedUserProfile,
  setSavedUserProfile,
  type UserProfile,
} from "@/utils/apiClient";

type TamanhoInstituicao = "1-escola" | "2-ou-mais";
type Periodicidade = "mensal" | "anual";

const PRECO_BASE_MENSAL = 169.0;
const PRECO_BASE_ANUAL = 490.8;
const ACRESCIMO_PROF_EXTRA = 29.0;

function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

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
  const datePickerRef = useRef<HTMLInputElement>(null);
  const { escolas: escolasData } = useData();
  const [tamanho, setTamanho] = useState<TamanhoInstituicao>("1-escola");
  const [escolaId, setEscolaId] = useState("");
  const [etapa, setEtapa] = useState<"tamanho" | "checkout" | "fale-conosco">("tamanho");
  const [email, setEmail] = useState("");

  // Estados da tela de pagamento institucional
  const [periodicidade, setPeriodicidade] = useState<Periodicidade>("mensal");
  const [nomeCompleto, setNomeCompleto] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [uf, setUf] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [municipios, setMunicipios] = useState<DropDownOption[]>([]);
  const [carregandoMunicipios, setCarregandoMunicipios] = useState(false);
  const [qtdProfessores, setQtdProfessores] = useState("5");
  const [emailAdmin, setEmailAdmin] = useState("");
  const [souAdminEscola, setSouAdminEscola] = useState(false);
  const [souProfessorEscola, setSouProfessorEscola] = useState(false);
  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [cienteRenovacao, setCienteRenovacao] = useState(false);
  const [etapaPagamento, setEtapaPagamento] = useState<
    "idle" | "aguardando" | "concluido"
  >("idle");
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const { alerta, mostrar, limpar } = useAlerta();

  function mostrarErro(descricao: string) {
    mostrar({ tom: "danger", titulo: "Não foi possível continuar", descricao });
  }

  const qtdProfNum = Math.max(1, Number.parseInt(qtdProfessores || "5", 10) || 5);
  const profExtras = Math.max(0, qtdProfNum - 5);
  const valorMensalTotal = PRECO_BASE_MENSAL + profExtras * ACRESCIMO_PROF_EXTRA;
  const valorAnualTotal = PRECO_BASE_ANUAL + profExtras * ACRESCIMO_PROF_EXTRA * 12;
  const valorAtual = periodicidade === "mensal" ? valorMensalTotal : valorAnualTotal;
  const valorAtualFormatado = formatarMoeda(valorAtual);
  const unidadeAtual = periodicidade === "mensal" ? "mês" : "ano";
  const dataRenovacao = calcularDataRenovacao(periodicidade);

  const opcoesEscolas: DropDownOption[] = useMemo(
    () => (escolasData ?? []).map((e) => ({ value: e.id, label: e.nome })),
    [escolasData]
  );

  const handleVoltar = () => {
    if (etapa === "fale-conosco" || etapa === "checkout") {
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
      return;
    }
    setEtapa("checkout");
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

  async function verificarPlanoAtivo(): Promise<boolean> {
    if (!getAuthToken()) return false;
    try {
      const resp = await apiDbFetch("/autenticar/perfil");
      if (!resp.ok) return false;
      const perfil = (await resp.json()) as UserProfile;
      const salvo = getSavedUserProfile();
      setSavedUserProfile({ ...(salvo ?? {}), ...perfil });
      return (perfil.plano ?? "").toLowerCase().includes("institucional");
    } catch {
      return false;
    }
  }

  async function iniciarAssinatura() {
    if (!getAuthToken()) {
      mostrarErro("Faça login para assinar o plano Institucional.");
      return;
    }
    if (!souAdminEscola && !souProfessorEscola) {
      mostrarErro("Selecione pelo menos uma opção: administrador ou professor da escola.");
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
      const escolaNum = Number.parseInt(escolaId, 10);
      const resp = await apiDbFetch("/pagamentos/checkout", {
        method: "POST",
        body: JSON.stringify({
          nome_plano: "institucional",
          tipo_cont: tipoCont,
          documento_cont: docDigitos,
          ...(Number.isFinite(escolaNum) && escolaNum > 0 ? { id_escola: escolaNum } : {}),
          ...(!souAdminEscola && emailAdmin.trim() ? { email_institucional: emailAdmin.trim() } : {}),
          adm_pode_chat: souProfessorEscola,
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
        const virouInst = await verificarPlanoAtivo();
        if (ativo && virouInst) {
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
        router.push("/escolas");
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [etapaPagamento, router]);

  if (etapa === "checkout") {
    return (
      <div className="flex h-auto w-full items-start justify-center bg-surface-muted px-4 py-8 lg:h-full lg:overflow-y-auto lg:px-10 lg:py-4">
        <div className="my-auto flex w-full flex-col items-center justify-center gap-6 lg:max-w-[1125px] lg:flex-row lg:items-start xl:max-w-[1324px] xl:gap-8 2xl:max-w-[1655px] 2xl:gap-10">
          <div className="flex w-full max-w-[520px] flex-col rounded-[32px] bg-surface-base p-5 sm:p-7 lg:min-h-[545px] lg:max-w-[589px] lg:flex-[866] lg:rounded-[34px] lg:p-6 xl:min-h-[632px] xl:max-w-[693px] xl:rounded-[40px] xl:p-8 2xl:min-h-[790px] 2xl:max-w-[866px] 2xl:rounded-[50px] 2xl:p-10">
            <div className="flex items-start gap-2.5 lg:gap-4 xl:gap-5 2xl:gap-6">
              <button
                type="button"
                aria-label="Voltar"
                onClick={handleVoltar}
                className="cursor-pointer text-primary transition-colors hover:text-secondary"
              >
                <ChevronLeft className="h-5 w-5 2xl:h-6 2xl:w-6" />
              </button>

              <div className="mt-0.5 flex min-w-0 flex-1 flex-col gap-4 lg:mt-1 lg:gap-4 lg:pr-7 xl:mt-1.5 xl:gap-5 xl:pr-10 2xl:mt-2 2xl:gap-7 2xl:pr-12">
                <div className="flex flex-col gap-1 xl:gap-1.5 2xl:gap-2">
                  <div className="h-fit w-fit rounded-3xl bg-surface-warning px-2.5 py-0.5 text-[11px] 2xl:px-3 2xl:py-1 2xl:text-xs">
                    <span className="font-bold text-ink">INSTITUCIONAL</span>
                  </div>
                  <p className="text-xs text-secondary 2xl:text-sm">
                    Configure seu plano institucional
                  </p>
                </div>

                <div className="flex gap-3 lg:gap-7 xl:gap-10 2xl:gap-12">
                  {(
                    [
                      { id: "mensal", titulo: "Mensal", preco: `${formatarMoeda(PRECO_BASE_MENSAL)}/mês` },
                      { id: "anual", titulo: "Anual", preco: `${formatarMoeda(PRECO_BASE_ANUAL)}/ano` },
                    ] as const
                  ).map((opcao) => {
                    const selecionado = periodicidade === opcao.id;
                    return (
                      <button
                        key={opcao.id}
                        type="button"
                        onClick={() => setPeriodicidade(opcao.id)}
                        className={`flex h-[68px] min-w-0 flex-1 cursor-pointer flex-col items-start justify-center rounded-[22px] border-3 bg-transparent px-3.5 text-left transition-colors lg:h-[62px] lg:w-[135px] lg:flex-none lg:rounded-[20px] xl:h-[73px] xl:w-[153px] xl:rounded-[24px] xl:px-4 2xl:h-[91px] 2xl:w-[191px] 2xl:rounded-[30px] 2xl:px-5 ${
                          selecionado ? "border-surface-warning" : "border-sunken"
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

                <form className="flex w-full flex-col gap-3 lg:gap-3 xl:gap-4 2xl:gap-5">
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
                        onChange={(e) => setDataNascimento(formatarData(e.target.value))}
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

                  <div className="flex flex-col gap-1.5 pt-0.5">
                    <p className="text-xs font-semibold text-primary 2xl:text-sm">
                      Configuração da sua Escola
                    </p>
                    <p className="text-[11px] text-secondary 2xl:text-xs">
                      *Equipes maiores de 5 professores possuem o acréscimo de R$29,00/mês por docente
                    </p>
                    <div className="flex flex-col gap-2.5 sm:flex-row lg:gap-3">
                      <div className="flex w-full sm:w-40 shrink-0 items-center justify-between rounded-[70px] bg-sunken px-4 py-1">
                        <input
                          type="number"
                          placeholder="Qtd. Professores"
                          value={qtdProfessores}
                          onChange={(e) => setQtdProfessores(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key.length === 1 && !/[0-9]/.test(e.key)) {
                              e.preventDefault();
                            }
                          }}
                          className="w-full bg-transparent text-xs text-primary placeholder:text-secondary outline-none 2xl:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <div className="-mr-1 -space-y-1.5 flex flex-col justify-center">
                          <button
                            type="button"
                            aria-label="Aumentar quantidade de professores"
                            onClick={() =>
                              setQtdProfessores((prev) =>
                                String((Number.parseInt(prev || "5", 10) || 5) + 1),
                              )
                            }
                            className="cursor-pointer text-secondary hover:text-primary"
                          >
                            <ChevronUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label="Diminuir quantidade de professores"
                            onClick={() =>
                              setQtdProfessores((prev) =>
                                String(Math.max(1, (Number.parseInt(prev || "5", 10) || 5) - 1)),
                              )
                            }
                            className="cursor-pointer text-secondary hover:text-primary"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <Input
                        type="email"
                        placeholder="Email do administrador"
                        value={souAdminEscola ? "" : emailAdmin}
                        onChange={(e) => setEmailAdmin(e.target.value)}
                        disabled={souAdminEscola}
                        className={`px-4 py-1 text-xs lg:py-1 xl:py-1.5 2xl:text-sm ${
                          souAdminEscola ? "cursor-not-allowed opacity-50" : ""
                        }`}
                      />
                    </div>
                    <div className="flex flex-wrap gap-x-5 gap-y-1 pt-0.5">
                      <CheckBox checked={souAdminEscola} onChange={setSouAdminEscola}>
                        Sou o administrador dessa escola
                      </CheckBox>
                      <CheckBox checked={souProfessorEscola} onChange={setSouProfessorEscola}>
                        Sou professor nessa escola
                      </CheckBox>
                    </div>
                  </div>
                </form>

                <div className="h-[2px] w-full bg-sunken" />

                <div className="flex flex-col gap-2 lg:gap-1.5 xl:gap-2.5 2xl:gap-3">
                  {BENEFICIOS_INSTITUCIONAL.map((beneficio, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full bg-surface-warning 2xl:h-4 2xl:w-4" />
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
                <span>Institucional {periodicidade}</span>
                <span>{valorAtualFormatado}</span>
              </div>
              <div className="flex items-end justify-between font-bold">
                <span>Total a pagar hoje</span>
                <span>{valorAtualFormatado}</span>
              </div>
            </div>

            <div className="mt-3 flex min-h-[64px] w-full max-w-[639px] items-center rounded-[20px] bg-sunken px-4 py-3 text-xs text-secondary lg:mt-2.5 lg:h-[60px] lg:min-h-0 lg:py-0 xl:mt-4 xl:h-[70px] xl:px-5 2xl:mt-5 2xl:h-[88px] 2xl:px-6 2xl:text-sm">
              <p>
                Sua assinatura será renovada automaticamente em {dataRenovacao}. O
                valor cobrado será {valorAtualFormatado}/{unidadeAtual}.
              </p>
            </div>

            <div className="mt-3 flex flex-col gap-2 lg:mt-2.5 lg:gap-1.5 xl:mt-4 xl:gap-2.5 2xl:mt-5 2xl:gap-3">
              <CheckBox checked={aceitaTermos} onChange={setAceitaTermos} />
              <CheckBox checked={cienteRenovacao} onChange={setCienteRenovacao}>
                Estou ciente de que meu plano Institucional renova automaticamente a cada{" "}
                {unidadeAtual} e que posso cancelar quando quiser, em
                Configurações &gt; Planos.
              </CheckBox>
            </div>

            <div className="mt-4 lg:mt-3 xl:mt-6 2xl:mt-8">
              <Button
                type="button"
                variant="warning"
                disabled={
                  !aceitaTermos ||
                  !cienteRenovacao ||
                  (!souAdminEscola && !souProfessorEscola) ||
                  etapaPagamento !== "idle"
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
