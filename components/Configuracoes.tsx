import BarraPesquisa from "./Input";
import Blurfundo from "./Blurfundo";

export default function Configuracoes() {
  return (
    <Blurfundo>
      <div className="flex h-[460px] w-[727px] overflow-hidden rounded-[40px] bg-[#FFFDFA]">
        <SidebarEscura />
        <PainelClaro />
      </div>
    </Blurfundo>
  );
}

function SidebarEscura() {
  return (
    <div className="flex w-[184px] shrink-0 flex-col gap-5 bg-[#3D3838] px-5 py-6 text-[#EDEBE8]">
      <h1 className="text-lg text-white">Configurações</h1>

      <BarraPesquisa type="search" />

      <nav className="flex flex-col gap-1">
        <button className="flex items-center gap-2 rounded-full bg-[#F0F0F0] px-3 py-2 text-sm text-[#433F3F]">
          Geral
        </button>
        <button className="flex items-center gap-2 rounded-full px-3 py-2 text-left text-sm text-[#D8D4D2] hover:bg-white/5">
          Conta
        </button>
        <button className="flex items-center gap-2 rounded-full px-3 py-2 text-left text-sm text-[#D8D4D2] hover:bg-white/5">
          Privacidade
        </button>
      </nav>
    </div>
  );
}

function PainelClaro() {
  return (
    <section className="relative flex-1 overflow-y-auto px-8 py-6 text-[#3D3838]">
      <BotaoFechar />
      <GeralConfig />
    </section>
  );
}

function BotaoFechar() {
  return (
    <button className="absolute right-6 top-6 text-[#797979] hover:text-[#3D3838]">
      ✕
    </button>
  );
}

export function GeralConfig() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="mb-2 text-base">Perfil</h2>
        <div className="divide-y divide-[#DAD6D3]">
          <LinhaConfig label="Avatar">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C9BEF0] text-xs text-[#433F3F]">
              RS
            </div>
          </LinhaConfig>

          <LinhaConfig label="Nome Completo">
            <CampoValor value="Rafaela Silva" />
          </LinhaConfig>

          <LinhaConfig label="Como o MetamorphIA deveria te chamar">
            <CampoValor value="Prof. Rafaela" />
          </LinhaConfig>
        </div>
      </div>

      <div>
        <h3 className="text-sm">Instruções para o MetamorphIA</h3>
        <p className="mt-1 text-xs text-[#9A9592]">
          O MetamorphIA terá isso em mente durante as conversas
        </p>
        <textarea
          placeholder="ex: faça perguntas de esclarecimento antes de dar respostas detalhadas"
          className="mt-3 h-16 w-full resize-none rounded-xl bg-[#E2DFDC] px-4 py-3 text-xs text-[#9A9592] placeholder:text-[#9A9592] focus:outline-none"
        />
      </div>

      <div>
        <h2 className="mb-2 text-base">Preferências</h2>
        <LinhaConfig label="Aparência">
          <ToggleAparencia />
        </LinhaConfig>
      </div>
    </div>
  );
}

export function ContaConfig() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base">Conta</h2>
      <p className="text-sm text-[#797979]">
        Gerencie os dados da sua conta.
      </p>
    </div>
  );
}

export function PrivacidadeConfig() {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-base">Privacidade</h2>
      <p className="text-sm text-[#797979]">
        Controle o que é compartilhado e armazenado.
      </p>
    </div>
  );
}

function LinhaConfig({ label, children }) {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-sm">{label}</span>
      {children}
    </div>
  );
}

function CampoValor({ value }) {
  return (
    <div className="rounded-lg bg-[#E2DFDC] px-4 py-1.5 text-sm">
      {value}
    </div>
  );
}

function ToggleAparencia() {
  return (
    <div className="flex items-center gap-2">
      <span>☀️</span>
      <span>🌙</span>
    </div>
  );
}