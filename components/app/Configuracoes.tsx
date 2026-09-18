"use client";

import { ReactNode } from "react";
import { useState } from "react";
import BarraPesquisa from "@/components/common/Input";
import Blurfundo from "@/components/common/Blurfundo";
import { X , Sun, Moon} from 'lucide-react'
import engrenagem from "@/public/engrenagem.svg";
import circulo_conta from "@/public/circulo_conta.svg";
import cadeado from "@/public/cadeado.svg";
import { FormDeletaConta, FormDesconecta } from "@/components/app/forms/FormConta";
import Link from "next/link";

interface SidebarProps {
  abaAtiva: string;
  setAbaAtiva: (aba: string) => void;
}

interface PainelProps {
  Preencher: ReactNode;
  onClose?: () => void;
}

interface LinhaConfigProps {
  label: string;
  children: ReactNode;
}

interface CampoValorProps {
  value: string;
}

interface ConfiguracoesProps {
  onClose?: () => void;
}

export default function Configuracoes({
  onClose,
}: ConfiguracoesProps) {
  const [abaAtiva, setAbaAtiva] = useState("geral");

  return (
    <Blurfundo>
      <div className="flex h-[590px] w-[890px] absolute overflow-hidden rounded-[40px] bg-[#F0F0F0]">
        <SidebarEscura
          abaAtiva={abaAtiva}
          setAbaAtiva={setAbaAtiva}
        />

        <PainelClaro
          Preencher={renderizarAba(abaAtiva)}
          onClose={onClose}
        />
      </div>
    </Blurfundo>
  );
}

function renderizarAba(aba : string) {
  if (aba === "conta") return <ContaConfig />;
  if (aba === "privacidade") return <PrivacidadeConfig />;
  return <GeralConfig />;
}

function SidebarEscura({ abaAtiva, setAbaAtiva } : SidebarProps) {
  return (
    <div className="flex w-[210px] shrink-0 flex-col gap-2 bg-[#433F3F] px-5 py-5 text-[#EDEBE8]">
      <h1 className="text-[28px] text-[#F0F0F0] font-(family-name:--font-text-me-one)">Configurações</h1>
    
      <BarraPesquisa type="search" placeholder="Procurar" className="w-full"/>

      <nav className="flex flex-col gap-1">
        <div
          className={`flex items-center gap-2 rounded-full px-3 py-2 text-[14px] cursor-pointer ${
            abaAtiva === "geral" ? "bg-[#4C4C4C]" : "hover:bg-[#4C4C4C]"
          } text-[#F0F0F0]`}
          onClick={() => setAbaAtiva("geral")}
        >
          <img src={engrenagem.src} />
          Geral
        </div>

        <div
          className={`flex items-center gap-2 rounded-full px-3 py-2 text-left text-[14px] cursor-pointer ${
            abaAtiva === "conta" ? "bg-[#4C4C4C]" : "hover:bg-[#4C4C4C]"
          } text-[#F0F0F0]`}
          onClick={() => setAbaAtiva("conta")}
        >
          <img src={circulo_conta.src} />
          Conta
        </div>

        <div
          className={`flex items-center gap-2 rounded-full px-3 py-2 text-left text-[14px] cursor-pointer ${
            abaAtiva === "privacidade" ? "bg-[#4C4C4C]" : "hover:bg-[#4C4C4C]"
          } text-[#F0F0F0]`}
          onClick={() => setAbaAtiva("privacidade")}
        >
          <img src={cadeado.src} />
          Privacidade
        </div>
      </nav>
    </div>
  );
}

function PainelClaro({ Preencher, onClose }: PainelProps) {
  return (
    <section className="relative flex-1 overflow-y-auto px-8 py-6 text-[#3D3838]">
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
      className="absolute top-6 right-6 cursor-pointer hover:text-[#797979]"
    >
      <X className="h-6 w-6" />
    </button>
  );
}

export function GeralConfig() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className={`text-[25px] font-(family-name:--font-text-me-one)`}>Perfil</h2>
        <div className="divide-y-2 divide-[#D9D9D9]">
          <LinhaConfig label="Avatar">
            <div className="flex h-10 w-10 items-center justify-center rounded-full text-[18px] bg-[#D4C7F8] text-[#433F3F]">
              RS
            </div>
          </LinhaConfig>

          <LinhaConfig label="Nome Completo">
            <CampoValor value="Rafaela Silva" />
          </LinhaConfig>

          <LinhaConfig label="Como o MetamorphIA deveria te chamar">
            <CampoValor value="Prof. Rafaela" />
          </LinhaConfig>

          <div className="py-3">
          <h3 className="text-[18px]">Instruções para o MetamorphIA</h3>
          <p className="text-[14px] text-[#797979]">
            O MetamorphIA terá isso em mente durante as conversas
          </p>
          <textarea
            placeholder="ex: faça perguntas de esclarecimento antes de dar respostas detalhadas"
            className="mt-3 h-20 w-full resize-none rounded-[30px] bg-[#D9D9D9] px-4 py-3 text-[14px] text-[#797979] placeholder:text-[#797979] focus:outline-none overflow-auto scrollbar-none"
          />
          </div>
        </div>  
      </div>

      
      <div>
        <h2 className="text-[25px] font-(family-name:--font-text-me-one)">Preferências</h2>
        <div className="divide-y-2 divide-[#D9D9D9]">
          <LinhaConfig label="Aparência">
            <Mode />
          </LinhaConfig>
        </div>
      </div>
    </div>
  );
}

export function ContaConfig() {
  const [mostrarFormDeleta, setMostrarFormDeleta] = useState(false);
  const [mostrarFormDesconecta, setMostrarFormDesconecta] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className={`text-[25px] font-(family-name:--font-text-me-one)`}>Conta</h2>
        <div className="divide-y-2 divide-[#D9D9D9]">

          <LinhaConfig label="Desconectar de todos os dispositivos">
            <button className="rounded-[70px] bg-[#D9D9D9] px-8 py-1 text-[18px] hover:bg-[#C0C0C0]" onClick={() => setMostrarFormDesconecta(true)}>
              Sair
            </button>
          </LinhaConfig>

          <LinhaConfig label="Apagar sua conta">
            <button className="rounded-[70px] bg-[#FF9999] px-8 py-1 text-[18px] hover:bg-[#FF9999]/80" onClick={() => setMostrarFormDeleta(true)}>
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

export function PrivacidadeConfig() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[25px] font-(family-name:--font-text-me-one)">Privacidade</h2>
        <div className="divide-y-2 divide-[#D9D9D9]">
          <div className="py-3 pl-6 w-full resize-none rounded-[30px] bg-[#D9D9D9] px-4 py-3">
          <p className="px-3 text-[14px] text-[#797979]">A MetamorphIA acredita em práticas transparentes de dados. Saiba como suas informações são protegidas ao usar os produtos da MetamorphIA e visite nossos Termos de Privacidade e Termos de Uso para mais detalhes.</p>
          <div className="flex space-x-20 gap-4 mt-3">
          <Link href="./privacidade">
          <div className="px-3 text-[14px] text-[#797979] font-bold underline hover:cursor-pointer">
              Termos de Privacidade
          </div>
          </Link>
          <Link href="./uso">
          <div className="text-[14px] text-[#797979] font-bold underline hover:cursor-pointer">
              Termos de Uso
          </div>
          </Link>
          </div>
          </div>
        </div>

      <h2 className="text-[25px] font-(family-name:--font-text-me-one)">Seus dados</h2>
        <div className="divide-y-2 divide-[#D9D9D9]">
          
          <LinhaConfig label="Exportar dados">
            <button className="rounded-[70px] bg-[#D9D9D9] px-8 py-1 text-[18px] hover:bg-[#C0C0C0]">
              Exportar dados
            </button>
          </LinhaConfig>
        </div>
    </div>
  );
}

function LinhaConfig({ label, children } : LinhaConfigProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-[18px]">{label}</span>
      {children}
    </div>
  );
}

function CampoValor({ value } : CampoValorProps) {
  return (
    <div className="rounded-[70px] bg-[#D9D9D9] px-8 py-1 text-[18px]">
      {value}
    </div>
  );
}

function Mode() {
  const [modeAtivo, setModeAtivo] = useState<"light" | "dark">("light");

  const handleModeChange = (mode: "light" | "dark") => {
    setModeAtivo(mode);
    // PLACEHOLDER: if (mode === "dark") {} ...
  };

  return (
    <div className="flex items-center gap-2">
      {/* MODO CLARO */}
      <button
        type="button"
        aria-label="Modo claro"
        onClick={() => handleModeChange("light")}
        className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
          modeAtivo === "light"
            ? "bg-[#FFD279]"
            : "hover:bg-[#D9D9D9]"
        }`}
      >
        <Sun className="h-5 w-5 text-[#433F3F]" />
      </button>

      {/* MODO ESCURO */}
      <button
        type="button"
        aria-label="Modo escuro"
        onClick={() => handleModeChange("dark")}
        className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
          modeAtivo === "dark"
            ? "bg-[#D4C7F8]"
            : "hover:bg-[#D9D9D9]"
        }`}
      >
        <Moon className="h-5 w-5 text-[#433F3F]" />
      </button>
    </div>
  );
}
