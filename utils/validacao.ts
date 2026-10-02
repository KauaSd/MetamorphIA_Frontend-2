export function validarEmail(valor: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor.trim());
}

// telefone fixo tem 10 digitos e celular 11, usado pelo cadastro e pelo login
export function validarTelefone(valor: string): boolean {
  const digitos = valor.replace(/\D/g, "");

  if (digitos.length !== 10 && digitos.length !== 11) return false;
  if (digitos.length === 11 && digitos[2] !== "9") return false;

  return true;
}

// aceita telefone ou e-mail no mesmo campo, usado pelo login e pela recuperacao de senha
export function ehEmailOuTelefone(valor: string): boolean {
  const trimmed = valor.trim();

  return trimmed.includes("@")
    ? validarEmail(trimmed)
    : validarTelefone(trimmed);
}

// cada regra de senha, usada pelo checklist RegrasSenha
export interface RegraSenha {
  id: string;
  texto: string;
  atendida: (senha: string) => boolean;
}

export const REGRAS_SENHA: RegraSenha[] = [
  {
    id: "tamanho",
    texto: "Pelo menos 12 caracteres",
    atendida: (senha) => senha.length >= 12,
  },
  {
    id: "numero",
    texto: "Pelo menos um número",
    atendida: (senha) => /[0-9]/.test(senha),
  },
  {
    id: "minuscula",
    texto: "Pelo menos uma letra minúscula",
    atendida: (senha) => /[a-z]/.test(senha),
  },
  {
    id: "maiuscula",
    texto: "Pelo menos uma letra maiúscula",
    atendida: (senha) => /[A-Z]/.test(senha),
  },
  {
    id: "especial",
    texto: "Pelo menos um caractere especial",
    atendida: (senha) => /[@#$%^&*+=!?._-]/.test(senha),
  },
];

// devolve os textos das regras ainda nao cumpridas, usado pelo checklist e pelo cadastro
export function validarSenha(senha: string): string[] {
  return REGRAS_SENHA.filter((regra) => !regra.atendida(senha)).map(
    (regra) => regra.texto,
  );
}