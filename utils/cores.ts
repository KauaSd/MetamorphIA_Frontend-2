/**
 * Utilitários de cor baseados nos tokens CSS do projeto.
 * Úteis para lógica que precisa acessar cores fora do CSS.
 */

export const TOKENS = {
  // Superfícies
  "surface-base": "var(--surface-base)",
  "surface-base-hover": "var(--surface-base-hover)",
  "surface-overlay": "var(--surface-overlay)",
  "surface-overlay-hover": "var(--surface-overlay-hover)",
  "surface-muted": "var(--surface-muted)",
  "surface-secondary": "var(--surface-secondary)",
  "surface-inverse": "var(--surface-inverse)",
  "surface-inverse-hover": "var(--surface-inverse-hover)",
  "surface-accent": "var(--surface-accent)",
  "surface-accent-strong": "var(--surface-accent-strong)",
  "surface-danger": "var(--surface-danger)",
  "surface-danger-strong": "var(--surface-danger-strong)",
  "surface-warning": "var(--surface-warning)",
  "surface-success": "var(--surface-success)",
  "surface-info": "var(--surface-info)",
  "surface-positive": "var(--surface-positive)",
  "surface-tag-other": "var(--surface-tag-other)",

  // Neurodivergências
  "neuro-tdah": "var(--neuro-tdah)",
  "neuro-tea": "var(--neuro-tea)",
  "neuro-disllexia": "var(--neuro-disllexia)",
  "neuro-discalculia": "var(--neuro-discalculia)",
  "neuro-ahs": "var(--neuro-ahs)",
  "neuro-outro": "var(--neuro-outro)",

  // Texto
  primary: "var(--primary)",
  secondary: "var(--secondary)",
  tertiary: "var(--tertiary)",
  muted: "var(--muted)",
  ink: "var(--ink)",
  "ink-muted": "var(--ink-muted)",

  // Estados
  sunken: "var(--sunken)",
  "sunken-hover": "var(--sunken-hover)",
  accent: "var(--accent)",
  danger: "var(--danger)",
  warning: "var(--warning)",
  inverse: "var(--inverse)",
  "inverse-muted": "var(--inverse-muted)",
} as const;

export type TokenName = keyof typeof TOKENS;

/**
 * Retorna o valor CSS de um token.
 * No servidor/SSR retorna a variável CSS; no cliente pode retornar o valor computado.
 */
export function getToken(token: TokenName): string {
  return TOKENS[token];
}

/**
 * Mapeia tokens para classes Tailwind (via @theme inline).
 * Use quando precisar de classes dinâmicas.
 */
export const TW_COLOR_MAP = {
  // Superfícies
  "surface-base": "bg-surface-base",
  "surface-base-hover": "hover:bg-surface-base-hover",
  "surface-overlay": "bg-surface-overlay",
  "surface-overlay-hover": "hover:bg-surface-overlay-hover",
  "surface-muted": "bg-surface-muted",
  "surface-secondary": "bg-surface-secondary",
  "surface-inverse": "bg-surface-inverse",
  "surface-inverse-hover": "hover:bg-surface-inverse-hover",
  "surface-accent": "bg-surface-accent",
  "surface-accent-strong": "bg-surface-accent-strong",
  "surface-danger": "bg-surface-danger",
  "surface-danger-strong": "bg-surface-danger-strong",
  "surface-warning": "bg-surface-warning",
  "surface-success": "bg-surface-success",
  "surface-info": "bg-surface-info",
  "surface-positive": "bg-surface-positive",
  "surface-tag-other": "bg-surface-tag-other",

  // Neurodivergências
  "neuro-tdah": "bg-neuro-tdah",
  "neuro-tea": "bg-neuro-tea",
  "neuro-disllexia": "bg-neuro-disllexia",
  "neuro-discalculia": "bg-neuro-discalculia",
  "neuro-ahs": "bg-neuro-ahs",
  "neuro-outro": "bg-neuro-outro",

  // Texto
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
  muted: "text-muted",
  ink: "text-ink",
  "ink-muted": "text-ink-muted",

  // Estados
  sunken: "bg-sunken",
  "sunken-hover": "hover:bg-sunken-hover",
  accent: "bg-accent",
  danger: "bg-danger",
  warning: "bg-warning",
  inverse: "bg-inverse",
  "inverse-muted": "text-inverse-muted",
} as const;

/**
 * Retorna uma classe Tailwind de cor de superfície baseada no nome (determinística).
 * Útil para avatares/bolinhas com fundo colorido consistente.
 * Retorna classes como "bg-surface-accent" para uso no className.
 */
export function corDoNome(nome: string): string {
  if (!nome) return "bg-surface-muted";

  let hash = 0;
  for (let i = 0; i < nome.length; i++) {
    hash = nome.charCodeAt(i) + ((hash << 5) - hash);
  }

  const cores = [
    "bg-surface-accent",
    "bg-surface-danger",
    "bg-surface-warning",
    "bg-surface-success",
    "bg-surface-info",
    "bg-surface-positive",
    "bg-surface-tag-other",
  ];

  return cores[Math.abs(hash) % cores.length];
}

/**
 * Retorna o valor CSS da cor (para uso em style={{ background: ... }}).
 */
export function corDoNomeCSS(nome: string): string {
  if (!nome) return "var(--surface-muted)";

  let hash = 0;
  for (let i = 0; i < nome.length; i++) {
    hash = nome.charCodeAt(i) + ((hash << 5) - hash);
  }

  const cores = [
    "var(--surface-accent)",
    "var(--surface-danger)",
    "var(--surface-warning)",
    "var(--surface-success)",
    "var(--surface-info)",
    "var(--surface-positive)",
    "var(--surface-tag-other)",
  ];

  return cores[Math.abs(hash) % cores.length];
}

/**
 * Fonte única de verdade: neurodivergência -> token de superfície.
 * Tanto a bolinha do menu (gradienteNeuro) quanto o chip TagNeuro
 * (corPorNeuro) saem daqui, então nunca mais divergem de cor.
 */
const NEURO_TOKEN = {
  TDAH: "neuro-tdah",
  TEA: "neuro-tea",
  Dislexia: "neuro-disllexia",
  Discalculia: "neuro-discalculia",
  "AH/SD": "neuro-ahs",
  Outro: "neuro-outro",
} as const satisfies Record<string, TokenName>;

type NeuroLabel = keyof typeof NEURO_TOKEN;

/**
 * Retorna a classe Tailwind de cor para uma neurodivergência.
 */
export function corPorNeuro(neuro: string): string {
  const token = NEURO_TOKEN[neuro as NeuroLabel] ?? "surface-muted";
  return `bg-${token}`;
}

/**
 * Retorna um valor CSS de gradiente baseado nas neurodivergências.
 * Cada neurodivergência vira uma fatia de pizza na bolinha, com uma transição
 * suave entre as fatias para o corte não ficar abrupto.
 * Usa var(--token) para acompanhar a troca de tema.
 */
export function gradienteNeuro(neuros: string[]): string {
  if (!neuros || neuros.length === 0) {
    return TOKENS["surface-muted"];
  }

  const cores = neuros.map(
    (n) => TOKENS[NEURO_TOKEN[n as NeuroLabel] ?? "surface-muted"]
  );

  // com uma neurodivergência só não há fatia para cortar
  if (cores.length === 1) return cores[0];

  const fatia = 100 / cores.length;
  // cada borda mistura a cor da fatia com a seguinte; no máximo 12% do círculo
  const suave = Math.min(fatia / 2, 12);
  const pct = (v: number) => `${Number(v.toFixed(4))}%`;

  const paradas = [`${cores[0]} ${pct(0)}`];

  for (let i = 0; i < cores.length; i++) {
    const cor = cores[i];
    const proxima = cores[(i + 1) % cores.length];
    const fim = (i + 1) * fatia;

    // segura a cor até o fim da fatia
    paradas.push(`${cor} ${pct(fim - suave)}`);
    // e só troca de cor depois da faixa de mistura
    paradas.push(`${proxima} ${pct(i === cores.length - 1 ? 100 : fim + suave)}`);
  }

  return `conic-gradient(${paradas.join(", ")})`;
}