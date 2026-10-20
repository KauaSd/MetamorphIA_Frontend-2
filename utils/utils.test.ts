import { describe, expect, it } from "vitest";
import { corDoNome, corDoNomeCSS, corPorNeuro, getToken, gradienteNeuro } from "./cores";
import { formatarData } from "./datas";
import { gerarAvatar, pegainicial, pegarIniciais } from "./pegariniciais";
import {
  ehEmailOuTelefone,
  pareceTelefone,
  validarEmail,
  validarSenha,
  validarTelefone,
} from "./validacao";

describe("utils/cores", () => {
  it("retorna cor deterministica e fallback quando nome e vazio", () => {
    expect(corDoNome("")).toBe("bg-surface-muted");
    expect(corDoNomeCSS("")).toBe("var(--surface-muted)");
    expect(corDoNome("Ana")).toBe(corDoNome("Ana"));
    expect(corDoNomeCSS("Ana")).toBe(corDoNomeCSS("Ana"));
  });

  it("mapeia neurodivergencias para tokens e gera gradiente", () => {
    expect(getToken("surface-base")).toBe("var(--surface-base)");
    expect(corPorNeuro("TEA")).toBe("bg-neuro-tea");
    expect(corPorNeuro("Inexistente")).toBe("bg-surface-muted");
    expect(gradienteNeuro([])).toBe("var(--surface-muted)");
    expect(gradienteNeuro(["TEA"])).toBe("var(--neuro-tea)");
    expect(gradienteNeuro(["TEA", "TDAH"])).toContain("conic-gradient(");
  });
});

describe("utils/pegariniciais", () => {
  it("extrai iniciais de nomes simples e compostos", () => {
    expect(pegarIniciais("")).toBe("");
    expect(pegarIniciais("   ")).toBe("");
    expect(pegarIniciais("Maria")).toBe("MA");
    expect(pegarIniciais("João Silva Santos")).toBe("JS");
    expect(pegainicial("Ana Clara")).toBe("AC");
    expect(gerarAvatar("Ana Clara")).toEqual({
      iniciais: "AC",
      corFundo: corDoNomeCSS("Ana Clara"),
    });
  });
});

describe("utils/datas", () => {
  it("formata DD/MM/AAAA em pt-BR curto sem 'de'", () => {
    const formatada = formatarData("15/05/2026");
    expect(formatada).toContain("15");
    expect(formatada).toContain("2026");
    expect(formatada).not.toContain(" de ");
  });
});

describe("utils/validacao", () => {
  it("valida emails e telefones", () => {
    expect(validarEmail("prof@escola.com.br")).toBe(true);
    expect(validarEmail("invalido@")).toBe(false);
    expect(validarTelefone("(11) 98765-4321")).toBe(true);
    expect(validarTelefone("(11) 3456-7890")).toBe(true);
    expect(validarTelefone("(11) 88765-4321")).toBe(false);
    expect(ehEmailOuTelefone("prof@escola.com")).toBe(true);
    expect(ehEmailOuTelefone("11987654321")).toBe(true);
    expect(pareceTelefone("(11) 98765-4321")).toBe(true);
    expect(pareceTelefone("abc@def")).toBe(false);
  });

  it("lista pendencias da senha", () => {
    expect(validarSenha("SenhaForte@123")).toEqual([]);
    expect(validarSenha("curta")).toHaveLength(4);
  });
});
