"use client";

import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import BarraPesquisa from "@/components/common/Input";
import Blurfundo from "@/components/common/Blurfundo";
import { OverlayCarregando } from "@/components/common/Carregando";
import { X, Sun, Moon } from "lucide-react";
import engrenagem from "@/public/engrenagem.svg";
import circulo_conta from "@/public/circulo_conta.svg";
import cadeado from "@/public/cadeado.svg";
import astroid from "@/public/astroid.svg";
import { FormDeletaConta, FormDesconecta, FormAlterarSenha} from "@/components/app/forms/FormConta";
import CampoEditavel from "@/components/app/configuracoes/CampoEditavel";
import BarraAlteracoes from "@/components/app/configuracoes/BarraAlteracoes";
import { useData } from "@/components/app/state/DataProvider";
import { saveTeacherName } from "@/utils/data/controller";
import {
  apiDbFetch,
  getSavedUserProfile,
  setSavedUserProfile,
} from "@/utils/apiClient";
import Link from "next/link";
import {
  DEFAULT_THEME,
  THEME_ATTRIBUTE,
  THEME_STORAGE_KEY,
  lerTemaSalvo,
  type Theme,
} from "@/utils/theme";

interface SidebarProps {
  abaAtiva: string;
  setAbaAtiva: (aba: string) => void;
  termo: string;
  setTermo: (termo: string) => void;
  onEscolher: (item: ItemBusca) => void;
  onClose?: () => void;
}

interface PainelProps {
  Preencher: ReactNode;
  onClose?: () => void;
  painelRef: React.RefObject<HTMLElement | null>;
}

interface LinhaConfigProps {
  id?: string;
  destaque?: string | null;
  label: string;
  children: ReactNode;
}

interface CampoValorProps {
  value: string;
}

interface ConfiguracoesProps {
  onClose?: () => void;
}

// rascunho do perfil em edicao na aba geral, mora no Configuracoes porque a
// barra de salvar/cancelar fica fora da aba
interface PerfilProps {
  nome: string;
  nomeCompleto?: string;
  aoDigitar: (valor: string) => void;
  instrucoes: string;
  aoDigitarInstrucoes: (valor: string) => void;
}

interface ItemBusca {
  id: string;
  rotulo: string;
  aba: string;
}

// itens da busca, cada id aponta para um elemento do JSX das abas
const ITENS_BUSCA: ItemBusca[] = [
  { id: "cfg-aba-geral", rotulo: "Geral", aba: "geral" },
  { id: "cfg-aba-conta", rotulo: "Conta", aba: "conta" },
  { id: "cfg-aba-privacidade", rotulo: "Privacidade", aba: "privacidade" },
  {
    id: "cfg-como-te-chamar",
    rotulo: "Como o MetamorphIA deveria te chamar",
    aba: "geral",
  },
  {
    id: "cfg-instrucoes",
    rotulo: "Instruções para o MetamorphIA",
    aba: "geral",
  },
  { id: "cfg-modo-claro", rotulo: "Modo claro", aba: "geral" },
  { id: "cfg-modo-escuro", rotulo: "Modo escuro", aba: "geral" },

  {
    id: "cfg-desconectar",
    rotulo: "Desconectar desse dispositivo",
    aba: "conta",
  },
  {
    id: "cfg-alterar-senha",
    rotulo: "Trocar minha senha",
    aba: "conta",
  },
  { id: "cfg-apagar-conta", 
    rotulo: "Apagar sua conta", 
    aba: "conta" 
  },
  { id: "cfg-planos", 
    rotulo: "Planos", 
    aba: "planos" 
  },
  {
    id: "cfg-termos-privacidade",
    rotulo: "Termos de Privacidade",
    aba: "privacidade",
  },
  { id: "cfg-termos-uso", rotulo: "Termos de Uso", aba: "privacidade" },
];

const ROTULO_ABA: Record<string, string> = {
  geral: "Geral",
  conta: "Conta",
  privacidade: "Privacidade",
  planos: "Planos",
};

// tira acento e caixa, usado pelo filtrar
function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

// filtra os itens da busca, usado pela SidebarEscura
function filtrar(termo: string) {
  const busca = normalizar(termo.trim());
  if (!busca) return [];
  return ITENS_BUSCA.filter((item) => normalizar(item.rotulo).includes(busca));
}

export default function Configuracoes({
  onClose,
}: ConfiguracoesProps) {
  const { teacherName, nomeReal, recarregar } = useData();
  const [abaAtiva, setAbaAtiva] = useState("geral");
  const [termo, setTermo] = useState("");
  const [alvo, setAlvo] = useState<string | null>(null);
  const painelRef = useRef<HTMLElement>(null);

  // rascunho do nome e instrucoes da IA: a pessoa digita direto no campo e so grava (ou descarta)
  // pela barra de alteracoes do rodape
  const [nome, setNome] = useState(teacherName ?? "");
  const [ultimoNomeServidor, setUltimoNomeServidor] = useState(teacherName ?? "");
  const [instrucoesSalvas, setInstrucoesSalvas] = useState(
    () => getSavedUserProfile()?.instrucoes_ia ?? "",
  );
  const [instrucoes, setInstrucoes] = useState(
    () => getSavedUserProfile()?.instrucoes_ia ?? "",
  );

  if ((teacherName ?? "") !== ultimoNomeServidor) {
    setUltimoNomeServidor(teacherName ?? "");
    if (nome === ultimoNomeServidor) {
      setNome(teacherName ?? "");
    }
  }

  const nomeAlterado = nome.trim() !== (teacherName ?? "").trim();
  const instrucoesAlteradas = instrucoes.trim() !== instrucoesSalvas.trim();
  const alterado = nomeAlterado || instrucoesAlteradas;

  // saida tentada com pendencia: a barra de alteracoes fica vermelha ate
  // salvar, cancelar ou digitar de novo
  const [bloqueada, setBloqueada] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const caixaRef = useRef<HTMLDivElement>(null);

  async function salvarAlteracoes() {
    setSalvando(true);
    try {
      const limpo = nome.trim();
      if (nomeAlterado) {
        const resultado = await saveTeacherName(limpo);
        if (!resultado.ok) throw new Error(resultado.erro.titulo);
        setNome(limpo);
      }
      if (instrucoesAlteradas) {
        const resp = await apiDbFetch("/autenticar/instrucoes", {
          method: "PATCH",
          body: JSON.stringify({ instrucoes_ia: instrucoes.trim() }),
        });
        if (!resp.ok) throw new Error("Não foi possível salvar as instruções");
        setInstrucoes(instrucoes.trim());
        setInstrucoesSalvas(instrucoes.trim());
        const perfilAtual = getSavedUserProfile();
        if (perfilAtual) {
          setSavedUserProfile({ ...perfilAtual, instrucoes_ia: instrucoes.trim() });
        }
      }
      await recarregar();
      setBloqueada(false);
    } finally {
      setSalvando(false);
    }
  }

  function cancelarAlteracoes() {
    setNome(teacherName ?? "");
    setInstrucoes(instrucoesSalvas);
    setBloqueada(false);
  }

  function aoDigitar(valor: string) {
    setNome(valor);
    setBloqueada(false);
  }

  function aoDigitarInstrucoes(valor: string) {
    setInstrucoes(valor);
    setBloqueada(false);
  }

  // o blur e o x chamam isso: sem alteracao fecha, com alteracao so alerta
  function tentarFechar() {
    if (!alterado) {
      onClose?.();
      return;
    }
    setBloqueada(true);
    chacoalhar();
  }

  // chacoalhada leve na box do modal (no navegador; sem suporte nao faz nada)
  function chacoalhar() {
    caixaRef.current?.animate?.(
      [
        { transform: "translateX(0)" },
        { transform: "translateX(-6px)" },
        { transform: "translateX(6px)" },
        { transform: "translateX(-4px)" },
        { transform: "translateX(4px)" },
        { transform: "translateX(0)" },
      ],
      { duration: 320, easing: "ease-in-out" },
    );
  }

  // rola ate o item escolhido, usado pelo Configuracoes
  useEffect(() => {
    if (!alvo) return;

    painelRef.current
      ?.querySelector(`#${CSS.escape(alvo)}`)
      ?.scrollIntoView({ block: "center" });

    const timer = setTimeout(() => setAlvo(null), 1500);
    return () => clearTimeout(timer);
  }, [alvo, abaAtiva]);

  function escolherItem(item: ItemBusca) {
    setAbaAtiva(item.aba);
    setAlvo(item.id);
    setTermo("");
  }

  return (
    <Blurfundo onClose={salvando ? undefined : tentarFechar}>
      <div
        ref={caixaRef}
        className="fixed inset-0 z-50 flex h-dvh w-screen flex-col overflow-hidden rounded-none bg-surface-muted md:relative md:inset-auto md:h-[min(88vh,590px)] md:w-full md:max-w-[890px] md:flex-row md:rounded-[40px]"
      >
        <OverlayCarregando ativo={salvando} mensagem="Salvando alterações..." />
        <SidebarEscura
          abaAtiva={abaAtiva}
          setAbaAtiva={setAbaAtiva}
          termo={termo}
          setTermo={setTermo}
          onEscolher={escolherItem}
          onClose={tentarFechar}
        />

        <PainelClaro
          Preencher={renderizarAba(
            abaAtiva,
            alvo,
            {
              nome,
              nomeCompleto: nomeReal || teacherName || "Professor(a)",
              aoDigitar,
              instrucoes,
              aoDigitarInstrucoes,
            },
          )}
          onClose={tentarFechar}
          painelRef={painelRef}
        />
      </div>

      {alterado && (
        <BarraAlteracoes
          nome={nome}
          bloqueada={bloqueada}
          onSalvar={salvarAlteracoes}
          onCancelar={cancelarAlteracoes}
        />
      )}
    </Blurfundo>
  );
}

// escolhe a aba pelo nome, usado pelo Configuracoes
function renderizarAba(
  aba: string,
  alvo: string | null,
  perfil: PerfilProps,
) {
  if (aba === "conta") return <ContaConfig destaque={alvo} />;
  if (aba === "privacidade") return <PrivacidadeConfig />;
  if (aba === "planos") return <PlanosConfig destaque={alvo} />;
  return <GeralConfig destaque={alvo} perfil={perfil} />;
}

const ABAS = [
  { chave: "geral", rotulo: "Geral", icone: engrenagem },
  { chave: "conta", rotulo: "Conta", icone: circulo_conta },
  { chave: "privacidade", rotulo: "Privacidade", icone: cadeado },
  { chave: "planos", rotulo: "Plano", icone: astroid },
];

function SidebarEscura({ abaAtiva, setAbaAtiva, termo, setTermo, onEscolher, onClose } : SidebarProps) {
  const buscaRef = useRef<HTMLDivElement>(null);
  const resultados = filtrar(termo);
  const searchingAberto = termo.trim() !== "";

  // fecha a lista de resultados ao clicar fora dela
  useEffect(() => {
    if (!searchingAberto) return;

    function clicar(event: MouseEvent) {
      if (buscaRef.current && !buscaRef.current.contains(event.target as Node)) {
        setTermo("");
      }
    }
    document.addEventListener("mousedown", clicar);
    return () => document.removeEventListener("mousedown", clicar);
  }, [searchingAberto, setTermo]);

  return (
    <div className="flex w-full shrink-0 flex-col gap-2 bg-surface-inverse px-4 py-4 text-inverse-muted md:w-[210px] md:px-5 md:py-5">
      <div className="flex items-center justify-between gap-2">
        <h1 className="font-(family-name:--font-text-me-one) text-2xl text-inverse-muted md:text-[28px]">Configurações</h1>
        <button
          type="button"
          aria-label="Fechar"
          onClick={onClose}
          className="cursor-pointer text-inverse-muted hover:text-inverse md:hidden"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="relative min-w-0" ref={buscaRef}>
        <BarraPesquisa
          type="search"
          placeholder="Procurar"
          className="w-full"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
        />

{/* lista de resultados da busca */}
        <div
          className={`absolute left-0 top-full z-30 mt-1 w-full max-w-[260px] max-h-[136px] overflow-hidden rounded-[30px] bg-surface-base text-primary shadow-lg transition-all duration-200 ease-out origin-top ${
            searchingAberto
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none -translate-y-2 scale-95 opacity-0"
          }`}
        >
          {/* lista rolavel */}
          <ul className="max-h-[136px] overflow-y-auto overscroll-contain py-1.5 pl-1.5 pr-2.5 [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-surface-base-hover">
          {resultados.length === 0 ? (
            <li className="px-2.5 py-1.5 text-[13px] text-secondary">
              Nada encontrado
            </li>
          ) : (
            resultados.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onEscolher(item)}
                  className="flex w-full min-w-0 items-center gap-2 rounded-[70px] px-2.5 py-1.5 text-left text-[13px] transition-colors hover:bg-sunken"
                >
                  <span className="truncate">{item.rotulo}</span>
                  <span className="ml-auto shrink-0 text-[11px] text-secondary">
                    {ROTULO_ABA[item.aba]}
                  </span>
                </button>
              </li>
            ))
          )}
          </ul>
        </div>
      </div>

      {/* abas geral, conta e privacidade */}
      <nav className="flex flex-row flex-wrap gap-1 md:flex-col">
        {ABAS.map((aba) => (
          <div
            key={aba.chave}
            id={`cfg-aba-${aba.chave}`}
            className={`flex items-center gap-2 rounded-full px-3 py-2 text-left text-[14px] cursor-pointer ${
              abaAtiva === aba.chave ? "bg-surface-inverse-hover" : "hover:bg-surface-inverse-hover"
            } text-inverse-muted`}
            onClick={() => setAbaAtiva(aba.chave)}
          >
            <img src={aba.icone.src} alt="" className="h-5 w-5 shrink-0 object-contain" />
            {aba.rotulo}
          </div>
        ))}
      </nav>
    </div>
  );
}

function PainelClaro({ Preencher, onClose, painelRef }: PainelProps) {
  return (
    <section
      ref={painelRef}
      className="relative min-w-0 flex-1 overflow-y-auto px-5 py-5 text-primary sm:px-8 sm:py-6"
    >
      {/* o x sempre aparece: sem alteracao fecha; com alteracao o onclose vira
          tentarFechar (só alerta) */}
      <BotaoFechar onClose={onClose} />
      {Preencher}
    </section>
  );
}

function BotaoFechar({onClose}: { onClose?: () => void;}) 
{
  return (
    <button
      type="button"
      aria-label="Fechar"
      onClick={onClose}
      className="absolute top-6 right-6 hidden cursor-pointer hover:text-secondary md:block"
    >
      <X className="h-6 w-6" />
    </button>
  );
}

export function GeralConfig({ destaque, perfil }: { destaque: string | null; perfil: PerfilProps }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className={`text-[25px] font-(family-name:--font-text-me-one)`}>Perfil</h2>
        <div className="divide-y-2 divide-sunken"> 

          <LinhaConfig id="cfg-nome-completo" destaque={destaque} label="Nome Completo">
            <CampoValor value={perfil.nomeCompleto || perfil.nome || "Professor(a)"} />
          </LinhaConfig>

          <LinhaConfig id="cfg-como-te-chamar" destaque={destaque} label="Como o MetamorphIA deveria te chamar">
            <CampoEditavel valor={perfil.nome} aoDigitar={perfil.aoDigitar} />
          </LinhaConfig>

          <div
            id="cfg-instrucoes"
            className={`-mx-3 scroll-mt-6 rounded-lg px-3 transition-colors duration-300 ${
              destaque === "cfg-instrucoes" ? "bg-surface-warning/40" : ""
            }`}
          >
          <div className="py-3">
          <h3 className="text-[18px]">Instruções para o MetamorphIA</h3>
          <p className="text-[14px] text-secondary">
            O MetamorphIA terá isso em mente durante as conversas
          </p>
          <textarea
            value={perfil.instrucoes}
            onChange={(e) => perfil.aoDigitarInstrucoes(e.target.value)}
            placeholder="ex: faça perguntas de esclarecimento antes de dar respostas detalhadas"
            className="mt-3 h-20 w-full resize-none rounded-[30px] bg-sunken px-4 py-3 text-[14px] text-primary placeholder:text-secondary focus:outline-none overflow-auto scrollbar-none"
          />
          </div>
          </div>
        </div>  
      </div>

      
      <div>
        <h2 className="text-[25px] font-(family-name:--font-text-me-one)">Preferências</h2>
        <div className="divide-y-2 divide-sunken">
          <LinhaConfig id="cfg-aparencia" destaque={destaque} label="Aparência">
            <Mode destaque={destaque} />
          </LinhaConfig>
        </div>
      </div>
    </div>
  );
}

export function ContaConfig({ destaque }: { destaque: string | null }) {
  const [mostrarFormDeleta, setMostrarFormDeleta] = useState(false);
  const [mostrarFormDesconecta, setMostrarFormDesconecta] = useState(false);
  const [mostrarFormAlterarSenha, setMostrarFormAlterarSenha] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[25px] font-(family-name:--font-text-me-one)">Conta</h2>
        <div className="divide-y-2 divide-sunken border-b-2 border-sunken">
          <LinhaConfig id="cfg-alterar-senha" destaque={destaque} label="Trocar minha senha">
            <button
              className="rounded-[70px] bg-sunken px-8 py-1 text-[18px] cursor-pointer transition-colors hover:bg-sunken-hover"
              onClick={() => setMostrarFormAlterarSenha(true)}
            >
              Trocar
            </button>
          </LinhaConfig>

          <LinhaConfig id="cfg-desconectar" destaque={destaque} label="Desconectar desse dispositivo">
            <button
              className="rounded-[70px] bg-sunken px-8 py-1 text-[18px] cursor-pointer transition-colors hover:bg-sunken-hover"
              onClick={() => setMostrarFormDesconecta(true)}
            >
              Sair
            </button>
          </LinhaConfig>

          <LinhaConfig id="cfg-apagar-conta" destaque={destaque} label="Apagar sua conta">
            <button
              className="rounded-[70px] bg-surface-danger px-8 py-1 text-[18px] text-ink cursor-pointer transition-colors hover:bg-surface-danger/80"
              onClick={() => setMostrarFormDeleta(true)}
            >
              Apagar conta
            </button>
          </LinhaConfig>
        </div>
      </div>
      {mostrarFormDeleta && (
        <FormDeletaConta
          onClose={() => setMostrarFormDeleta(false)}
        />
      )}
      {mostrarFormAlterarSenha && (
        <FormAlterarSenha
          onClose={() => setMostrarFormAlterarSenha(false)}
        />
      )}
      {mostrarFormDesconecta && (
        <FormDesconecta
          onClose={() => setMostrarFormDesconecta(false)}
        />
      )}
    </div>
  );
}

export function PrivacidadeConfig() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[25px] font-(family-name:--font-text-me-one)">Privacidade</h2>
      <div className="w-full rounded-[30px] bg-sunken px-7 py-5">
        <p className="text-[14px] leading-relaxed text-secondary">
          A MetamorphIA acredita em práticas transparentes de dados. Saiba como suas
          informações são protegidas ao usar os produtos da MetamorphIA e visite nossos{" "}
          <strong className="font-semibold">Termos de Privacidade</strong> e{" "}
          <strong className="font-semibold">Termos de Uso</strong> para mais detalhes.
        </p>
        <div className="mt-3 flex flex-wrap justify-center gap-6 sm:gap-16">
          <Link
            id="cfg-termos-privacidade"
            href="/privacidade"
            className="scroll-mt-6 text-[14px] font-bold text-secondary underline hover:cursor-pointer"
          >
            Termos de Privacidade
          </Link>
          <Link
            id="cfg-termos-uso"
            href="/uso"
            className="scroll-mt-6 text-[14px] font-bold text-secondary underline hover:cursor-pointer"
          >
            Termos de Uso
          </Link>
        </div>
      </div>
    </div>
  );
}

export function PlanosConfig({ destaque }: { destaque: string | null }) {
  const { plano } = useData();
  const planoRaw = (plano ?? getSavedUserProfile()?.plano ?? "normal").toLowerCase();
  const rotuloPlano =
    planoRaw === "pro"
      ? "PRO"
      : planoRaw.includes("institucional")
        ? "Institucional"
        : "Gratuito";

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-[25px] font-(family-name:--font-text-me-one)">Planos</h2>

      <div className="w-full rounded-full bg-sunken/50 px-5 py-2.5 text-sm text-primary sm:text-base">
        Você está no plano {rotuloPlano}
      </div>

      <div className="divide-y-2 divide-sunken border-y-2 border-sunken">
        <LinhaConfig id="cfg-planos" destaque={destaque} label="Conhecer outras assinaturas:">
          <Link
            href="/planos"
            className="inline-flex items-center justify-center rounded-full bg-surface-accent px-6 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-surface-accent-strong sm:text-base whitespace-nowrap"
          >
            Evoluir plano
          </Link>
        </LinhaConfig>
      </div>
    </div>
  );
}

function LinhaConfig({ id, destaque, label, children } : LinhaConfigProps) {
  return (
    <div
      id={id}
      className={`-mx-3 scroll-mt-6 px-3 transition-colors duration-300 ${
        destaque === id ? "bg-surface-warning/40" : ""
      }`}
    >
      <div className="flex flex-col items-start justify-between gap-2 py-3 sm:flex-row sm:items-center sm:gap-4">
        <span className="text-base sm:text-[18px]">{label}</span>
        {children}
      </div>
    </div>
  );
}

function CampoValor({ value } : CampoValorProps) {
  return (
    <div className="rounded-[70px] bg-sunken px-8 py-1 text-[18px]">
      {value}
    </div>
  );
}

function Mode({ destaque }: { destaque: string | null }) {
  // le o tema salvo, usado pelo Mode
  const [theme, setTheme] = useState<Theme>(() =>
    typeof window === "undefined" ? DEFAULT_THEME : lerTemaSalvo()
  );

  // aplica o atributo de tema no html
  useLayoutEffect(() => {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
  }, [theme]);

  function trocar(proximo: Theme) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, proximo);
    } catch {
      // sem storage o tema funciona so na sessao corrente
    }
    setTheme(proximo);
  }

  const destacar = (id: string) =>
    `scroll-mt-6 transition-colors duration-300 ${
      destaque === id ? "bg-surface-warning/40 rounded-full" : ""
    }`;

  return (
    <div className="flex items-center gap-2">
      {/* botao de modo claro */}
      <button
        type="button"
        id="cfg-modo-claro"
        aria-label="Modo claro"
        aria-pressed={theme === "light"}
        onClick={() => trocar("light")}
        className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${destacar("cfg-modo-claro")} ${
          theme === "light"
            ? "bg-surface-warning text-ink"
            : "text-primary hover:bg-sunken"
        }`}
      >
        <Sun className="h-5 w-5" />
      </button>

      {/* botao de modo escuro */}
      <button
        type="button"
        id="cfg-modo-escuro"
        aria-label="Modo escuro"
        aria-pressed={theme === "dark"}
        onClick={() => trocar("dark")}
        className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${destacar("cfg-modo-escuro")} ${
          theme === "dark"
            ? "bg-surface-accent text-ink"
            : "text-primary hover:bg-sunken"
        }`}
      >
        <Moon className="h-5 w-5" />
      </button>
    </div>
  );
}
