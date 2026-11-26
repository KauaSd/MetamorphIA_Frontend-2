export const OPCOES_COMPONENTE = [
  { value: "artes", label: "Artes" },
  { value: "matematica", label: "Matemática" },
  { value: "portugues", label: "Português" },
  { value: "ciencias", label: "Ciências" },
];

export const OPCOES_PERIODO = [
  { value: "1", label: "1º Bimestre" },
  { value: "2", label: "2º Bimestre" },
  { value: "3", label: "3º Bimestre" },
  { value: "4", label: "4º Bimestre" },
];

function normalizarSlugMateria(nome: string): string {
  const limpo = nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  if (limpo.includes("portugues")) return "portugues";
  if (limpo.includes("matematica")) return "matematica";
  if (limpo.includes("ciencia")) return "ciencias";
  if (limpo.includes("arte")) return "artes";
  if (limpo.includes("historia")) return "historia";
  if (limpo.includes("geografia")) return "geografia";
  if (limpo.includes("ingles")) return "ingles";
  if (limpo.includes("fisica")) return "ed_fisica";
  return limpo.replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") || "materia";
}

export function obterOpcoesComponente(tags?: string[] | null) {
  const validas = (tags ?? []).map((t) => t.trim()).filter(Boolean);
  if (validas.length === 0) return OPCOES_COMPONENTE;
  return validas.map((label) => ({
    value: normalizarSlugMateria(label),
    label,
  }));
}

export function componenteLabel(valor: string): string {
  const padrao = OPCOES_COMPONENTE.find((o) => o.value === valor)?.label;
  if (padrao) return padrao;
  const extras: Record<string, string> = {
    historia: "História",
    geografia: "Geografia",
    ingles: "L. Inglesa",
    ed_fisica: "Ed. Física",
  };
  return extras[valor] ?? valor;
}

export function periodoLabel(valor: string): string {
  return OPCOES_PERIODO.find((o) => o.value === valor)?.label ?? "";
}