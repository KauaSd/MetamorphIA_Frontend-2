const RE_TELEFONE = /(?:^|[^\d])(?:\+?55\s?)?(?:\(\d{2}\)\s?)?9?\d{4}[-.\s]?\d{4}(?:$|[^\d])/;
const RE_EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;
const RE_CPF = /\b\d{3}\.\d{3}\.\d{3}-\d{2}\b|\b\d{11}\b/;
const RE_CEP = /\b\d{5}-?\d{3}\b/;

export const AVISO_DADOS_SENSIVEIS =
  "Atenção: parece que você digitou um dado sensível (telefone, e-mail, CPF ou CEP). Evite usar dados reais.";

export function detectarDadosSensiveis(texto: string): string[] {
  const achados: string[] = [];
  if (RE_TELEFONE.test(texto)) achados.push("telefone");
  if (RE_EMAIL.test(texto)) achados.push("e-mail");
  if (RE_CPF.test(texto)) achados.push("CPF");
  if (RE_CEP.test(texto)) achados.push("CEP");
  return achados;
}