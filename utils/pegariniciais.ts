/**
 * Extrai as iniciais de um nome completo.
 * Ex: "João Silva Santos" -> "JS"
 *     "Maria" -> "MA"
 *     "" -> ""
 */

import { corDoNomeCSS } from "./cores";

export function pegarIniciais(nome: string): string {
  if (!nome || !nome.trim()) return "";

  const partes = nome.trim().split(/\s+/).filter(Boolean);

  if (partes.length === 1) {
    return partes[0].slice(0, 2).toUpperCase();
  }

  return (partes[0][0] + partes[1][0]).toUpperCase();
}

/**
 * Gera um avatar simples com iniciais e cor de fundo.
 * Retorna um objeto com as propriedades necessárias para renderizar.
 */
export function gerarAvatar(nome: string): { iniciais: string; corFundo: string } {
  return {
    iniciais: pegarIniciais(nome),
    corFundo: corDoNomeCSS(nome),
  };
}

/** Alias para compatibilidade com código existente */
export const pegainicial = pegarIniciais;