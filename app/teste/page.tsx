"use client";

import {
  GraduationCap,
  History,
  Search,
  Settings,
  Users,
} from "lucide-react";
import React from "react";

type Modo = "atual" | "centrado" | "proporcional" | "corrigido";

const MODOS: { id: Modo; label: string; desc: string }[] = [
  {
    id: "atual",
    label: "Atual",
    desc: "Estado atual (referência). Conteúdo igual ao site de hoje.",
  },
  {
    id: "centrado",
    label: "Centrado",
    desc: "Conteúdo em max-w-[1400px] mx-auto. Tamanho interno dos componentes NÃO muda.",
  },
  {
    id: "proporcional",
    label: "Escala proporcional",
    desc: "CSS zoom no wrapper inteiro — reduz tudo proporcionalmente, inclusive paddings/margens. Ajuste o fator no slider.",
  },
  {
    id: "corrigido",
    label: "Componentes corrigidos",
    desc: "Tamanhos dos componentes reduzidos (fontes, larguras, alturas, gaps internos). Paddings/margens das páginas mantidos. Já com quebras responsivas.",
  },
];

const VIEWPORTS = [
  { w: 1920, h: 1080 },
  { w: 1600, h: 900 },
  { w: 1440, h: 810 },
  { w: 1280, h: 720 },
  { w: 1024, h: 720 },
  { w: 768, h: 1024 },
  { w: 640, h: 900 },
  { w: 390, h: 844 },
];

const COR = {
  fundo: "bg-[#F0F0F0]",
  card: "bg-[#FFFDFA]",
  escur: "bg-[#433F3F]",
  texto: "text-[#433F3F]",
  cinza: "text-[#797979]",
  borda: "border-[#FFFDFA]",
};

const STATS = [
  { label: "Alunos", valor: "128" },
  { label: "Turmas", valor: "12" },
  { label: "Atividades adaptadas", valor: "340" },
];

const TURMAS = ["1º Ano N - Período", "2º Ano B"];

const MENU_ITENS = [
  { label: "Turmas", Icon: Users },
  { label: "Alunos", Icon: GraduationCap },
  { label: "Recentes", Icon: History },
  { label: "Configurações", Icon: Settings },
];

/* ------------------------- SIDEBAR ------------------------- */

function Sidebar({ compacto = false }: { compacto?: boolean }) {
  return (
    <aside
      className={`hidden md:flex h-full shrink-0 ${COR.escur} flex-col p-5 text-[#FFFDFA] ${
        compacto ? "w-20 items-center" : "w-72"
      }`}
    >
      <div className={`flex items-center ${compacto ? "justify-center" : "gap-2"}`}>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFFDFA] font-(family-name:--font-text-me-one) text-2xl text-[#433F3F]">
          M
        </div>
        {!compacto && (
          <p className="text-2xl md:text-3xl font-(family-name:--font-text-me-one) select-none">
            MetamorphIA
          </p>
        )}
      </div>

      <div className="my-5 w-full border-t border-[#FFFDFA]" />

      <nav className={`flex w-full flex-col ${compacto ? "items-center gap-6" : "gap-3"}`}>
        {MENU_ITENS.map(({ label, Icon }) => (
          <div key={label} className="flex h-[35px] w-full items-center">
            <div className={`flex items-center ${compacto ? "justify-center w-full" : "gap-4 cursor-pointer"}`}>
              <Icon className="h-4.5 w-4.5 shrink-0 text-[#FFFDFA]" />
              {!compacto && <p className="text-xl select-none">{label}</p>}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto w-full border-t border-[#FFFDFA] pt-3">
        <p className={`${compacto ? "hidden" : "text-xl"}`}>Sair</p>
      </div>
    </aside>
  );
}

/* ------------------------- HERO ------------------------- */

function Hero({ corrigido }: { corrigido?: boolean }) {
  return (
    <section className={corrigido ? "mb-8" : "mb-10"}>
      <h1
        className={`leading-normal ${COR.texto} ${
          corrigido ? "text-2xl sm:text-3xl" : "text-3xl sm:text-4xl"
        }`}
      >
        Cada criança aprende <b>do seu jeito.</b>
        <br /> A gente <span className="text-[#D4C7F8]">adapta!</span>
      </h1>
      <p className={`${corrigido ? "max-w-120" : "max-w-160"} mt-4 text-sm ${COR.cinza}`}>
        Nossa IA transforma qualquer atividade pedagógica em uma versão feita sob medida
        para crianças neurodivergentes — em segundos, sem precisar de formação especializada.
      </p>
    </section>
  );
}

/* ------------------------- STATS ------------------------- */

function Stats({ corrigido }: { corrigido?: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {STATS.map((s) => (
        <div
          key={s.label}
          className={`flex flex-col justify-between ${COR.card} ${
            corrigido ? "min-h-24 rounded-[40px] p-4" : "min-h-31.5 rounded-[70px] px-4 py-5"
          }`}
        >
          <p className={`${COR.cinza} ${corrigido ? "text-xs sm:text-sm" : "text-sm"}`}>
            {s.label}
          </p>
          <p
            className={`${COR.texto} ${
              corrigido ? "text-lg sm:text-xl" : "text-[28px]"
            }`}
          >
            {s.valor}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------- TURMAS ------------------------- */

function Turmas({ corrigido }: { corrigido?: boolean }) {
  return (
    <div
      className={`flex flex-wrap gap-5 ${
        corrigido ? "mt-4" : "mt-6"
      }`}
    >
      {TURMAS.map((nome) => (
        <div
          key={nome}
          className={`flex w-full flex-col justify-between ${COR.card} ${
            corrigido
              ? "h-28 sm:h-25 sm:w-[340px] md:w-[400px] rounded-[60px] px-8 py-4"
              : "h-38.5 sm:h-34 sm:w-[400px] md:w-[480px] rounded-[80px] px-12 py-6 sm:px-9"
          }`}
        >
          <p
            className={`font-(family-name:--font-text-me-one) ${COR.texto} ${
              corrigido
                ? "text-xl sm:text-2xl"
                : "text-[18px] sm:text-[24px] md:text-[28px]"
            }`}
          >
            {nome}
          </p>
          <p className={`${COR.cinza} text-sm`}>TDAH · 24 alunos</p>
        </div>
      ))}
    </div>
  );
}

/* ------------------------- RESUMO ------------------------- */

function Resumo({ corrigido }: { corrigido?: boolean }) {
  return (
    <div
      className={`mt-6 flex flex-col justify-between gap-3 ${COR.card} ${
        corrigido
          ? "min-h-28 rounded-[35px] px-8 py-4"
          : "min-h-36 rounded-[50px] px-13 py-5 sm:px-13"
      }`}
    >
      <p
        className={`font-(family-name:--font-text-me-one) ${COR.texto} ${
          corrigido ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
        }`}
      >
        Resumo da semana
      </p>
      <p className={`${COR.cinza} text-sm`}>
        3 atividades adaptadas, 2 novos alunos e 1 turma criada nos últimos 7 dias.
      </p>
    </div>
  );
}

/* ------------------------- CHAT ------------------------- */

function Chat({ corrigido }: { corrigido?: boolean }) {
  return (
    <div className={`mt-6 ${COR.card} rounded-[70px] p-8 text-center`}>
      <p
        className={`${COR.texto} ${
          corrigido
            ? "text-2xl sm:text-3xl md:text-4xl"
            : "text-3xl sm:text-4xl md:text-6xl"
        }`}
      >
        Olá, Professora!
      </p>
      <div
        className={`mx-auto mt-6 flex max-w-[40rem] items-center justify-between gap-4 rounded-[70px] bg-[#F0F0F0] px-5 ${
          corrigido ? "h-10" : "h-11"
        }`}
      >
        <Search className={`shrink-0 ${COR.cinza} ${corrigido ? "w-4 h-4" : "w-5 h-5"}`} />
        <input
          placeholder="Adapte uma atividade..."
          className={`w-full bg-transparent outline-none placeholder:${COR.cinza} ${
            corrigido
              ? "text-xs sm:text-sm md:text-base"
              : "text-sm sm:text-base md:text-lg"
          }`}
        />
        <button
          className={`shrink-0 rounded-full ${COR.escur} text-[#FFFDFA] ${
            corrigido ? "h-8 w-8 text-lg" : "h-10 w-10 text-xl"
          }`}
        >
          →
        </button>
      </div>
    </div>
  );
}

/* ------------------------- DEMO ------------------------- */

function DemoFull({ corrigido }: { corrigido?: boolean }) {
  return (
    <div className={`flex h-full ${COR.fundo} font-(family-name:--font-poppins)`}>
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-y-auto">
        <div className="px-10! sm:px-15! md:px-24! lg:px-64! py-8">
          <Hero corrigido={corrigido} />
          <Stats corrigido={corrigido} />
          <Turmas corrigido={corrigido} />
          <Resumo corrigido={corrigido} />
          <Chat corrigido={corrigido} />
        </div>
      </main>
    </div>
  );
}

function DemoMain({ corrigido }: { corrigido?: boolean }) {
  return (
    <main className={`h-full overflow-y-auto ${COR.fundo} font-(family-name:--font-poppins)`}>
      <div className="px-10! sm:px-15! md:px-24! lg:px-64! py-8">
        <Hero corrigido={corrigido} />
        <Stats corrigido={corrigido} />
        <Turmas corrigido={corrigido} />
        <Resumo corrigido={corrigido} />
        <Chat corrigido={corrigido} />
      </div>
    </main>
  );
}

/* ------------------------- PÁGINA DE TESTE ------------------------- */

export default function TesteSizing() {
  const [modo, setModo] = React.useState<Modo>("atual");
  const [zoom, setZoom] = React.useState(0.8);
  const [viewport, setViewport] = React.useState<{ w: number; h: number }>(VIEWPORTS[0]);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [fit, setFit] = React.useState(1);

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      setFit(Math.min(1, w / viewport.w));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [viewport.w]);

  const frameRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    el.scrollTop = 0;
  }, [modo, viewport.w]);

  const altura = Math.round(viewport.h * fit);

  return (
    <div className="min-h-screen bg-[#22201e] font-(family-name:--font-poppins)">
      {/* Painel de controle */}
      <div className="sticky top-0 z-50 bg-[#2a2826] px-4 py-3 text-[#FFFDFA]">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3">
          <p className="text-xl font-(family-name:--font-text-me-one) select-none">
            Teste de tamanho
          </p>

          <div className="flex flex-wrap gap-2">
            {MODOS.map((m) => (
              <button
                key={m.id}
                onClick={() => setModo(m.id)}
                className={`rounded-[70px] px-4 py-1.5 text-sm transition-colors ${
                  modo === m.id
                    ? "bg-[#FFFDFA] text-[#433F3F]"
                    : "bg-[#3d3a36] text-[#FFFDFA] hover:bg-[#4a4642]"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm">
            Viewport:
            <select
              value={viewport.w}
              onChange={(e) => {
                const v = VIEWPORTS.find((item) => item.w === Number(e.target.value))!;
                setViewport(v);
              }}
              className="rounded-[50px] bg-[#3d3a36] px-3 py-1.5 text-sm outline-none"
            >
              {VIEWPORTS.map((v) => (
                <option key={v.w} value={v.w}>
                  {v.w}×{v.h}
                </option>
              ))}
            </select>
          </label>

          {modo === "proporcional" && (
            <label className="flex items-center gap-2 text-sm">
              zoom:
              <input
                type="range"
                min={0.5}
                max={1}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-32"
              />
              <span className="w-12 text-right tabular-nums">{zoom.toFixed(2)}</span>
            </label>
          )}
        </div>

        <p className="mx-auto mt-2 max-w-[1400px] text-xs text-[#a9a5a0]">
          {MODOS.find((m) => m.id === modo)?.desc}
        </p>
      </div>

      {/* Palco */}
      <div ref={stageRef} className="overflow-x-auto p-4 sm:p-6">
        <div
          style={{
            width: "100%",
            height: altura + 16,
          }}
        >
          <div
            className="overflow-hidden rounded-lg border border-[#3d3a36] bg-[#F0F0F0] shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
            style={{
              width: viewport.w,
              height: viewport.h,
              transform: `scale(${fit})`,
              transformOrigin: "top left",
            }}
          >
            <div ref={frameRef} className="h-full overflow-auto">
              {modo === "atual" && <DemoFull />}
              {modo === "centrado" && (
                <div className="h-full">
                  <div className="mx-auto h-full max-w-[1400px]">
                    <DemoMain />
                  </div>
                </div>
              )}
              {modo === "proporcional" && (
                <div className="h-full" style={{ zoom }}>
                  <DemoFull />
                </div>
              )}
              {modo === "corrigido" && <DemoFull corrigido />}
            </div>
          </div>
          <p className="mt-2 text-center text-xs text-[#797979]">
            Frame {viewport.w}×{viewport.h} · {modo === "proporcional" ? `zoom ${zoom.toFixed(2)}` : "escala 1:1"}
            {fit < 1 && ` · reduzido ${fit.toFixed(2)}× apenas p/ caber na sua tela`}
          </p>
        </div>
      </div>
    </div>
  );
}