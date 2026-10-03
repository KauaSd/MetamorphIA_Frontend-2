import { pegainicial } from "@/utils/pegariniciais";

describe("pegainicial", () => {
  it("retorna as iniciais maiúsculas quando tem dois nomes", () => {
    expect(pegainicial("Lucas Olioti")).toBe("LO");
    expect(pegainicial("Ana Maria Silva")).toBe("AM");
  });

  it("retorna as duas primeiras letras quando tem um nome", () => {
    expect(pegainicial("Rafaela")).toBe("RA");
    expect(pegainicial("Jo")).toBe("JO");
  });

  it("retorna string vazia para vazio", () => {
    expect(pegainicial("")).toBe("");
    expect(pegainicial("   ")).toBe("");
  });

  it("ignora espaços extras", () => {
    expect(pegainicial("  Lucas   Olioti  ")).toBe("LO");
  });
});
