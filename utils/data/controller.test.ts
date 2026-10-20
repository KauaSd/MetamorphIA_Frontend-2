import { beforeEach, describe, expect, it } from "vitest";
import {
  addMessage,
  carregarDados,
  createAluno,
  createTurma,
  deleteAluno,
  deleteTurma,
  openChatWith,
  saveTeacherName,
  updateAluno,
  updateTurma,
} from "./controller";
import {
  conversasDoAluno,
  conversasRecentes,
  percentualNeurodivergentes,
  resolverChat,
  STORAGE_KEY,
  type Conversa,
} from "./types";

function criarStorageMemoria(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    key(index: number) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
  };
}

describe("utils/data", () => {
  beforeEach(() => {
    Object.defineProperty(globalThis, "window", {
      value: { localStorage: criarStorageMemoria() },
      configurable: true,
      writable: true,
    });
    window.localStorage.removeItem(STORAGE_KEY);
  });

  it("ordena conversas sem mutar o array original", () => {
    const lista: Conversa[] = [
      { id: "c1", alunoId: "a1", titulo: "Antiga", data: "08/05/2026", mensagens: [] },
      { id: "c2", alunoId: "a1", titulo: "Recente", data: "15/05/2026", mensagens: [] },
    ];
    const ordenada = conversasRecentes(lista);
    expect(ordenada.map((c) => c.id)).toEqual(["c2", "c1"]);
    expect(lista.map((c) => c.id)).toEqual(["c1", "c2"]);
    expect(conversasDoAluno(lista, "a1").map((c) => c.id)).toEqual(["c2", "c1"]);
  });

  it("executa fluxo completo no controller e cascata de exclusao", async () => {
    expect((await saveTeacherName("   ")).ok).toBe(false);
    expect((await saveTeacherName("Rafaela")).ok).toBe(true);

    const criarTurmaRes = await createTurma({ nome: "3º Ano A" });
    expect(criarTurmaRes.ok).toBe(true);

    let dados = await carregarDados();
    expect(dados.teacherName).toBe("Rafaela");
    expect(dados.turmas).toHaveLength(1);
    const turmaId = dados.turmas[0].id;

    expect((await updateTurma(turmaId, "3º Ano B")).ok).toBe(true);

    const criarAlunoRes = await createAluno({
      nome: "Lucas",
      idade: 9,
      neuro: ["TEA", "TDAH"],
      turmaId,
    });
    expect(criarAlunoRes.ok).toBe(true);

    dados = await carregarDados();
    expect(dados.alunos).toHaveLength(1);
    expect(percentualNeurodivergentes(dados.alunos)).toBe(100);
    const alunoId = dados.alunos[0].id;

    expect((await updateAluno(alunoId, { nome: "Lucas Silva" })).ok).toBe(true);

    const chatRes = await openChatWith(alunoId);
    expect(chatRes.ok).toBe(true);
    const conversaId = chatRes.ok ? chatRes.conversaId! : "";

    expect((await addMessage(conversaId, "Primeira pergunta", "professor")).ok).toBe(true);

    dados = await carregarDados();
    expect(dados.conversas[0].titulo).toBe("Primeira pergunta");

    const resolucao = resolverChat(dados.conversas, dados.alunos, {
      conversaId,
      alunoId: null,
    });
    expect(resolucao.status).toBe("ok");

    expect((await deleteTurma(turmaId)).ok).toBe(true);
    dados = await carregarDados();
    expect(dados.turmas).toHaveLength(0);
    expect(dados.alunos).toHaveLength(0);
    expect(dados.conversas).toHaveLength(0);

    expect((await deleteAluno(alunoId)).ok).toBe(false);
  });
});
