import {
  createTurma,
  updateTurma,
  deleteTurma,
  createAluno,
  updateAluno,
  deleteAluno,
  openChatWith,
  addMessage,
  saveTeacherName,
  carregarDados,
} from "@/utils/data/controller";

const STORAGE_KEY = "metamorphia:dados:v1";

describe("controller", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("cria turma e valida nome vazio", async () => {
    const res1 = await createTurma({ nome: "3º Ano A - Manhã" });
    expect(res1.ok).toBe(true);
    const res2 = await createTurma({ nome: "   " });
    expect(res2.ok).toBe(false);
    if (!res2.ok) {
      expect(res2.erro.titulo).toBeDefined();
    }
    const dados = await carregarDados();
    expect(dados.turmas.length).toBe(1);
    expect(dados.turmas[0].nome).toBe("3º Ano A - Manhã");
  });

  it("edita e exclui turma", async () => {
    await createTurma({ nome: "T1" });
    let dados = await carregarDados();
    const id = dados.turmas[0].id;
    const upd = await updateTurma(id, { nome: "T2" });
    expect(upd.ok).toBe(true);
    dados = await carregarDados();
    expect(dados.turmas[0].nome).toBe("T2");
    const del = await deleteTurma(id);
    expect(del.ok).toBe(true);
    dados = await carregarDados();
    expect(dados.turmas.length).toBe(0);
  });

  it("cria aluno com neuro e turma", async () => {
    await createTurma({ nome: "T1" });
    let dados = await carregarDados();
    const turmaId = dados.turmas[0].id;
    const res = await createAluno({
      nome: "Lucas Olioti",
      idade: 9,
      neurodivergencias: ["TDAH"],
      turmaId,
    });
    expect(res.ok).toBe(true);
    dados = await carregarDados();
    expect(dados.alunos.length).toBe(1);
    expect(dados.alunos[0].nome).toBe("Lucas Olioti");
  });

  it("abre chat com aluno e adiciona mensagens", async () => {
    await createAluno({
      nome: "Lucas",
      idade: 9,
      neurodivergencias: [],
      turmaId: null,
    });
    let dados = await carregarDados();
    const alunoId = dados.alunos[0].id;
    const abertura = await openChatWith(alunoId);
    expect(abertura.ok).toBe(true);
    if (abertura.ok) {
      expect(abertura.conversaId).toMatch(/^con_/);
    }
    const conversaId = abertura.ok && abertura.conversaId ? abertura.conversaId : "";
    await addMessage(conversaId, "Olá", "professor");
    await addMessage(conversaId, "Oi", "aluno");
    dados = await carregarDados();
    expect(dados.conversas.length).toBe(1);
    expect(dados.conversas[0].mensagens.length).toBe(2);
  });

  it("não adiciona mensagem vazia", async () => {
    await createAluno({ nome: "A", idade: null, neurodivergencias: [], turmaId: null });
    let dados = await carregarDados();
    const res = await openChatWith(dados.alunos[0].id);
    const cid = res.ok && res.conversaId ? res.conversaId : "";
    const msg = await addMessage(cid, "   ", "professor");
    expect(msg.ok).toBe(false);
  });

  it("salva nome do professor", async () => {
    const res = await saveTeacherName("Rafaela");
    expect(res.ok).toBe(true);
    const dados = await carregarDados();
    expect(dados.teacherName).toBe("Rafaela");
  });
});
