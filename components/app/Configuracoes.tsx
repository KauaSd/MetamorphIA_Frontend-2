"use client";

import { ReactNode, useEffect, useLayoutEffect, useRef, useState } from "react";
import BarraPesquisa from "@/components/common/Input";
import Blurfundo from "@/components/common/Blurfundo";
import { X, Sun, Moon } from "lucide-react";
import engrenagem from "@/public/engrenagem.svg";
import circulo_conta from "@/public/circulo_conta.svg";
import cadeado from "@/public/cadeado.svg";
import { FormDeletaConta, FormDesconecta } from "@/components/app/forms/FormConta";
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

interface ItemBusca {
  id: string;
  rotulo: string;
  aba: string;
}

// Cada entrada aponta para um id que existe no JSX das abas. Se um id sumir
// do JSX, apenas o scroll nao acontece -- a busca continua funcionando.
const ITENS_BUSCA: ItemBusca[] = [
  { id: "cfg-aba-geral", rotulo: "Geral", aba: "geral" },
  { id: "cfg-aba-conta", rotulo: "Conta", aba: "conta" },
  { id: "cfg-aba-privacidade", rotulo: "Privacidade", aba: "privacidade" },

  { id: "cfg-avatar", rotulo: "Avatar", aba: "geral" },
  { id: "cfg-nome-completo", rotulo: "Nome Completo", aba: "geral" },
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
    rotulo: "Desconectar de todos os dispositivos",
    aba: "conta",
  },
  { id: "cfg-apagar-conta", rotulo: "Apagar sua conta", aba: "conta" },

  {
    id: "cfg-termos-privacidade",
    rotulo: "Termos de Privacidade",
    aba: "privacidade",
  },
  { id: "cfg-termos-uso", rotulo: "Termos de Uso", aba: "privacidade" },
  { id: "cfg-exportar-dados", rotulo: "Exportar dados", aba: "privacidade" },
];

const ROTULO_ABA: Record<string, string> = {
  geral: "Geral",
  conta: "Conta",
  privacidade: "Privacidade",
};

// Remove acentos e caixa para que "privac", "Privacidade" e "descon" batam.
function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function filtrar(termo: string) {
  const busca = normalizar(termo.trim());
  if (!busca) return [];
  return ITENS_BUSCA.filter((item) => normalizar(item.rotulo).includes(busca));
}

export default function Configuracoes({
  onClose,
}: ConfiguracoesProps) {
  const [abaAtiva, setAbaAtiva] = useState("geral");
  const [termo, setTermo] = useState("");
  const [alvo, setAlvo] = useState<string | null>(null);
  const painelRef = useRef<HTMLElement>(null);

  // Roda depois que a aba nova entrou no DOM, senao o alvo ainda nao existe.
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
    <Blurfundo onClose={onClose}>
      <div className="flex h-[590px] w-[890px] absolute overflow-hidden rounded-[40px] bg-surface-muted">
        <SidebarEscura
          abaAtiva={abaAtiva}
          setAbaAtiva={setAbaAtiva}
          termo={termo}
          setTermo={setTermo}
          onEscolher={escolherItem}
        />

        <PainelClaro
          Preencher={renderizarAba(abaAtiva, alvo)}
          onClose={onClose}
          painelRef={painelRef}
        />
      </div>
    </Blurfundo>
  );
}

function renderizarAba(aba : string, alvo: string | null) {
  if (aba === "conta") return <ContaConfig destaque={alvo} />;
  if (aba === "privacidade") return <PrivacidadeConfig destaque={alvo} />;
  return <GeralConfig destaque={alvo} />;
}

const ABAS = [
  { chave: "geral", rotulo: "Geral", icone: engrenagem },
  { chave: "conta", rotulo: "Conta", icone: circulo_conta },
  { chave: "privacidade", rotulo: "Privacidade", icone: cadeado },
];

function SidebarEscura({ abaAtiva, setAbaAtiva, termo, setTermo, onEscolher } : SidebarProps) {
  const buscaRef = useRef<HTMLDivElement>(null);
  const resultados = filtrar(termo);
  const searchingAberto = termo.trim() !== "";

  // mousedown e nao click, para nao roubar o clique do item ao fechar.
  useEffect(() => {
    function clicar(event: MouseEvent) {
      if (buscaRef.current && !buscaRef.current.contains(event.target as Node)) {
        setTermo("");
      }
    }
    document.addEventListener("mousedown", clicar);
    return () => document.removeEventListener("mousedown", clicar);
  }, [setTermo]);

  return (
    <div className="flex w-[210px] shrink-0 flex-col gap-2 bg-surface-inverse px-5 py-5 text-inverse-muted">
      <h1 className="text-[28px] text-inverse-muted font-(family-name:--font-text-me-one)">Configurações</h1>

      <div className="relative min-w-0" ref={buscaRef}>
        <BarraPesquisa
          type="search"
          placeholder="Procurar"
          className="w-full"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
        />

{/* Flutua sobre o painel claro: width fixo maior que a sidebar,
            altura limitada a ~4 itens, com scroll quando sobra. Mesma
            transicao de opacidade/translate do DropDown.tsx. */}
        <div
          className={`absolute left-0 top-full z-30 mt-1 w-[260px] max-h-[136px] overflow-hidden rounded-[30px] bg-surface-base text-primary shadow-lg transition-all duration-200 ease-out origin-top ${
            searchingAberto
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none -translate-y-2 scale-95 opacity-0"
          }`}
        >
          {/* Quem rola e o ul interno, sem raio. O raio fica no div de
              fora, com overflow-hidden, que recorta a barra junto. */}
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

      <nav className="flex flex-col gap-1">
        {ABAS.map((aba) => (
          <div
            key={aba.chave}
            id={`cfg-aba-${aba.chave}`}
            className={`flex items-center gap-2 rounded-full px-3 py-2 text-left text-[14px] cursor-pointer ${
              abaAtiva === aba.chave ? "bg-surface-inverse-hover" : "hover:bg-surface-inverse-hover"
            } text-inverse-muted`}
            onClick={() => setAbaAtiva(aba.chave)}
          >
            <img src={aba.icone.src} />
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
      className="relative flex-1 overflow-y-auto px-8 py-6 text-primary"
    >
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
      className="absolute top-6 right-6 cursor-pointer hover:text-secondary"
    >
      <X className="h-6 w-6" />
    </button>
  );
}

export function GeralConfig({ destaque }: { destaque: string | null }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className={`text-[25px] font-(family-name:--font-text-me-one)`}>Perfil</h2>
        <div className="divide-y-2 divide-sunken">
          <LinhaConfig id="cfg-avatar" destaque={destaque} label="Avatar">
            <div className="flex h-10 w-10 items-center justify-center rounded-full text-[18px] bg-surface-accent text-ink">
              RS
            </div>
          </LinhaConfig>

          <LinhaConfig id="cfg-nome-completo" destaque={destaque} label="Nome Completo">
            <CampoValor value="Rafaela Silva" />
          </LinhaConfig>

          <LinhaConfig id="cfg-como-te-chamar" destaque={destaque} label="Como o MetamorphIA deveria te chamar">
            <CampoValor value="Prof. Rafaela" />
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
            placeholder="ex: faça perguntas de esclarecimento antes de dar respostas detalhadas"
            className="mt-3 h-20 w-full resize-none rounded-[30px] bg-sunken px-4 py-3 text-[14px] text-secondary placeholder:text-secondary focus:outline-none overflow-auto scrollbar-none"
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

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className={`text-[25px] font-(family-name:--font-text-me-one)`}>Conta</h2>
        <div className="divide-y-2 divide-sunken">

          <LinhaConfig id="cfg-desconectar" destaque={destaque} label="Desconectar de todos os dispositivos">
            <button className="rounded-[70px] bg-sunken px-8 py-1 text-[18px] hover:bg-sunken-hover" onClick={() => setMostrarFormDesconecta(true)}>
              Sair
            </button>
          </LinhaConfig>

          <LinhaConfig id="cfg-apagar-conta" destaque={destaque} label="Apagar sua conta">
            <button className="rounded-[70px] bg-surface-danger px-8 py-1 text-[18px] text-ink hover:bg-surface-danger/80" onClick={() => setMostrarFormDeleta(true)}>
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
      {mostrarFormDesconecta && (
        <FormDesconecta
          onClose={() => setMostrarFormDesconecta(false)}
        />
      )}
    </div>
  );
}

export function PrivacidadeConfig({ destaque }: { destaque: string | null }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[25px] font-(family-name:--font-text-me-one)">Privacidade</h2>
        <div className="divide-y-2 divide-sunken">
          <div className="py-3 pl-6 w-full resize-none rounded-[30px] bg-sunken px-4 py-3">
          <p className="px-3 text-[14px] text-secondary">A MetamorphIA acredita em práticas transparentes de dados. Saiba como suas informações são protegidas ao usar os produtos da MetamorphIA e visite nossos Termos de Privacidade e Termos de Uso para mais detalhes.</p>
          <div className="flex space-x-20 gap-4 mt-3">
          <Link href="./privacidade">
          <div id="cfg-termos-privacidade" className="scroll-mt-6 px-3 text-[14px] text-secondary font-bold underline hover:cursor-pointer">
              Termos de Privacidade
          </div>
          </Link>
          <Link href="./uso">
          <div id="cfg-termos-uso" className="scroll-mt-6 text-[14px] text-secondary font-bold underline hover:cursor-pointer">
              Termos de Uso
          </div>
          </Link>
          </div>
          </div>
        </div>

      <h2 className="text-[25px] font-(family-name:--font-text-me-one)">Seus dados</h2>
        <div className="divide-y-2 divide-sunken">
          
          <LinhaConfig id="cfg-exportar-dados" destaque={destaque} label="Exportar dados">
            <button className="rounded-[70px] bg-sunken px-8 py-1 text-[18px] hover:bg-sunken-hover">
              Exportar dados
            </button>
          </LinhaConfig>
        </div>
    </div>
  );
}

function LinhaConfig({ id, destaque, label, children } : LinhaConfigProps) {
  return (
    <div
      id={id}
      className={`-mx-3 scroll-mt-6 rounded-lg px-3 transition-colors duration-300 ${
        destaque === id ? "bg-surface-warning/40" : ""
      }`}
    >
      <div className="flex items-center justify-between py-3">
        <span className="text-[18px]">{label}</span>
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
  // O inicializador le o mesmo localStorage que o script inline do <head>,
  // entao o primeiro render do React bate com o DOM e nao ha hydration
  // mismatch. No servidor cai no tema padrao.
  const [theme, setTheme] = useState<Theme>(() =>
    typeof window === "undefined" ? DEFAULT_THEME : lerTemaSalvo()
  );

  // Reaplica o atributo depois do remount do StrictMode em dev, que limpa os
  // atributos de <html> e apaga o que o script gravou. No-op em producao.
  useLayoutEffect(() => {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
  }, [theme]);

  function trocar(proximo: Theme) {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, proximo);
    } catch {
      // Sem storage o tema ainda funciona na sessao corrente.
    }
    setTheme(proximo);
  }

  const destacar = (id: string) =>
    `scroll-mt-6 transition-colors duration-300 ${
      destaque === id ? "bg-surface-warning/40 rounded-full" : ""
    }`;

  return (
    <div className="flex items-center gap-2">
      {/* MODO CLARO */}
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

      {/* MODO ESCURO */}
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
