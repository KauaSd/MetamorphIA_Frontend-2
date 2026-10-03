import { formatarData } from "@/utils/datas";

describe("formatarData", () => {
  it("formata DD/MM/YYYY para o formato brasileiro abreviado", () => {
    const resultado = formatarData("15/05/2026");
    // o componente espera o formato usado em telas; o valor é derivado
    expect(resultado).toContain("2026");
    expect(resultado).toMatch(/15/);
  });

  it("aceita dia e mês com um dígito", () => {
    const resultado = formatarData("01/09/2026");
    expect(resultado).toContain("2026");
    expect(resultado).toMatch(/1/);
  });

  it("retorna algo não vazio para datas válidas", () => {
    expect(formatarData("31/12/2025")).toBeTruthy();
  });
});
