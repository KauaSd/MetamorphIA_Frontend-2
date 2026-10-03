import { validarSenha, validarEmail, validarTelefone } from "@/utils/validacao";

describe("validarSenha", () => {
  it("retorna erros quando vazia ou fraca", () => {
    expect(validarSenha("")).toContain("Pelo menos 12 caracteres");
    expect(validarSenha("1234567")).toContain("Pelo menos 12 caracteres");
    expect(validarSenha("abcdefgh")).toContain("Pelo menos um número");
    expect(validarSenha("12345678")).toContain("Pelo menos uma letra minúscula");
  });

  it("retorna lista vazia para senha forte", () => {
    expect(validarSenha("Abcdefgh123!")).toEqual([]);
  });
});

describe("validarEmail", () => {
  it("valida e-mails básicos", () => {
    expect(validarEmail("a@b.com")).toBe(true);
    expect(validarEmail("usuario@dominio.org.br")).toBe(true);
    expect(validarEmail("invalido")).toBe(false);
    expect(validarEmail("sem@dominio")).toBe(false);
  });
});

describe("validarTelefone", () => {
  it("valida telefones no formato aceito", () => {
    expect(validarTelefone("(11) 91234-5678")).toBe(true);
    expect(validarTelefone("11912345678")).toBe(true);
    expect(validarTelefone("123")).toBe(false);
  });
});
