import type { ReactNode } from "react";
import ButtonLink from "@/components/common/ButtonLink";

type PlanoId = "basico" | "pro" | "institucional";

type BotaoPlano = {
    texto: string;
    className?: string;
};

interface PlanoBase {
    tag: string;
    titulo: string;
    descricao: string;
    valor: string;
    periodo: string;
    borda: string;
    tagBg: string;
    tagTexto: string;
    bolinha: string;
    features: ReactNode[];
}

type PlanoConfig = PlanoBase & (
    | { temBotao: false }
    | { temBotao: true; botao: BotaoPlano }
);

// texto, cores e features de cada plano, usado pelo Planos
const CONFIG_PLANOS: Record<PlanoId, PlanoConfig> = {
    basico: {
        tag: "básico",
        titulo: "Gratuito",
        descricao: "Para conhecer e experimentar a tecnologia em sala de aula.",
        valor: "R$ 0",
        periodo: "/mês",
        borda: "border-surface-muted",
        tagBg: "bg-surface-muted",
        tagTexto: "text-secondary",
        bolinha: "bg-surface-success/50",
        features: [
            <>Até <b>2 turmas</b> cadastradas</>,
            <>Até <b>5 alunos</b> com perfil individual</>,
            <><b>10 adaptações</b> por mês com IA</>,
            <>Exportação em <b>PDF simples</b></>,
        ],
        temBotao: false,
    },
    pro: {
        tag: "individual pro",
        titulo: "Professor",
        descricao: "Para quem quer economizar horas de trabalho e incluir de verdade.",
        valor: "R$ 39",
        periodo: "/mês",
        borda: "border-surface-accent",
        tagBg: "bg-surface-accent/50",
        tagTexto: "text-ink",
        bolinha: "bg-surface-accent",
        features: [
            <><b>Turmas ilimitadas</b></>,
            <>Até 40 alunos com perfil individualizado</>,
            <><b>Adaptações ilimitadas com MetamorphIA</b></>,
            <>Personalização para TDAH, TEA, Dislexia e mais</>,
            <>Múltiplos formatos (visuais e pictogramas)</>,
            <>Relatórios de engajamento e evolução</>,
        ],
        temBotao: true,
        botao: {
            texto: "Comprar",
            className: "bg-surface-accent hover:bg-surface-accent-strong",
        },
    },
    institucional: {
        tag: "institucional",
        titulo: "Escola",
        descricao: "Para coordenação pedagógica, escolas completas e redes de ensino.",
        valor: "Personalizado",
        periodo: "",
        borda: "border-surface-warning/50",
        tagBg: "bg-surface-warning/25",
        tagTexto: "text-ink",
        bolinha: "bg-surface-warning",
        features: [
            <><b>Todos os recursos do plano</b> <br/> Professor para todos os docentes</>,
            <><b>Painel de coordenação e métricas institucionais</b></>,
            <>Os professores conseguem compartilhar alunos e turmas</>,
            <>Integração com ERP/sistema acadêmico</>,
        ],
        temBotao: true,
        botao: {
            texto: "Sou escola",
            className: "bg-surface-warning hover:bg-warning",
        },
    },
};

export default function Planos({ tipo }: { tipo: PlanoId }) {
    // dados do plano pedido, cai no basico se o tipo nao existir
    const c = CONFIG_PLANOS[tipo] ?? CONFIG_PLANOS.basico;

    return (
        <div className={`font-(family-name:--font-poppins) flex flex-col w-full max-w-[400px] md:w-100 min-h-150 border-5 ${c.borda} bg-surface-base rounded-3xl px-7 py-7`}>
            <div className="flex flex-col gap-5">
                <div className={`w-fit h-fit text-xs px-3 py-1 rounded-3xl ${c.tagBg}`}>
                    <span className={`font-bold ${c.tagTexto}`}>
                        {c.tag}
                    </span>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="font-(family-name:--font-text-me-one) text-2xl text-primary">
                        {c.titulo}
                    </span>
                    <span className="text-primary w-66 text-[14px]">
                        {c.descricao}
                    </span>
                </div>
                <span className="text-3xl font-extrabold">
                    {c.valor}
                    {c.periodo && (
                        <span className="font-medium text-base"> {c.periodo}</span>
                    )}
                </span>
                <div className="bg-surface-muted w-full h-0.5" />
                {/* lista de recursos do plano */}
                <div className="flex flex-col gap-3">
                    {c.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2">
                            <div className={`rounded-full w-4 h-4 shrink-0 mt-0.5 ${c.bolinha}`} />
                            <span className="text-[14px] leading-5">{feature}</span>
                        </div>
                    ))}
                </div>
            </div>
            {c.temBotao && (
                <div className="mt-auto mb-3 pt-5">
                    <ButtonLink className={`font-(family-name:--font-text-me-one) text-[12px] sm:text-[20px] ${c.botao.className ?? ""}`}>
                        {c.botao.texto}
                    </ButtonLink>
                </div>
            )}
        </div>
    );
}
