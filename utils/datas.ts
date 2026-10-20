const FORMATADOR_DATA_CURTA = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatarData(data: string): string {
  const [dia, mes, ano] = data.split("/");

  const dataFormatada = new Date(
    Number(ano),
    Number(mes) - 1,
    Number(dia),
  );

  return FORMATADOR_DATA_CURTA.format(dataFormatada).replace(/ de /g, " ");
}