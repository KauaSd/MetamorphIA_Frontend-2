export default function validarsenha(senha: string): string[] {
  const errors: string[] = [];

  if (senha.length < 12) {
    errors.push("A senha deve ter pelo menos 12 caracteres.");
  }

  if (!/[0-9]/.test(senha)) {
    errors.push("A senha deve conter pelo menos um número.");
  }

  if (!/[a-z]/.test(senha)) {
    errors.push("A senha deve conter pelo menos uma letra minúscula.");
  }

  if (!/[A-Z]/.test(senha)) {
    errors.push("A senha deve conter pelo menos uma letra maiúscula.");
  }

  if (!/[@#$%^&*+=!?._-]/.test(senha)) {
    errors.push("A senha deve conter pelo menos um caractere especial.");
  }

  return errors;
}