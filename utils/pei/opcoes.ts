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

export function componenteLabel(valor: string): string {
  return OPCOES_COMPONENTE.find((o) => o.value === valor)?.label ?? "";
}

export function periodoLabel(valor: string): string {
  return OPCOES_PERIODO.find((o) => o.value === valor)?.label ?? "";
}