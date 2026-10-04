import { STORAGE_KEY } from "./types";
import {
  alunosDaTurma,
  dadosVazios,
  gerarId,
  type Aluno,
  type AppData,
  type ClassInsights,
  type Conversa,
  type EngajamentoMateria,
  type StudentInsights,
  type Turma,
} from "./types";
import type { DataRepository } from "./dataRepository";

// as barras continuam sendo desenhadas em zero: e o esqueleto, nao um estado vazio
const ENGAJAMENTO_ZERADO: EngajamentoMateria[] = [
  { rotulo: "Leitura e Escrita", materia: "leitura", percentual: 0 },
  { rotulo: "Matemática", materia: "matematica", percentual: 0 },
  { rotulo: "Ciências", materia: "ciencias", percentual: 0 },
];

function ler(): AppData {
  if (typeof window === "undefined") return dadosVazios();

  try {
    const bruto = window.localStorage.getItem(STORAGE_KEY);
    if (!bruto) return dadosVazios();

    const guardado = JSON.parse(bruto) as Partial<AppData>;

    // cada lista tem fallback proprio: um storage de versao antiga nao pode estourar a tela
    return {
      teacherName: guardado.teacherName ?? null,
      turmas: guardado.turmas ?? [],
      alunos: guardado.alunos ?? [],
      conversas: guardado.conversas ?? [],
    };
  } catch {
    return dadosVazios();
  }
}

function gravar(dados: AppData): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dados));
}

export const localStorageRepository: DataRepository = {
  async listTurmas() {
    return ler().turmas;
  },

  async createTurma(input) {
    const dados = ler();
    const turma: Turma = { id: gerarId("tur"), nome: input.nome };
    gravar({ ...dados, turmas: [...dados.turmas, turma] });
    return turma;
  },

  async updateTurma(id, input) {
    const dados = ler();
    const existente = dados.turmas.find((turma) => turma.id === id);
    if (!existente) throw new Error(`Turma nao encontrada: ${id}`);

    const atualizada: Turma = { ...existente, nome: input.nome };
    gravar({
      ...dados,
      turmas: dados.turmas.map((turma) => (turma.id === id ? atualizada : turma)),
    });
    return atualizada;
  },

  async deleteTurma(id) {
    const dados = ler();
    if (!dados.turmas.some((turma) => turma.id === id)) {
      throw new Error(`Turma nao encontrada: ${id}`);
    }

    // cascata: sem isso sobraria aluno apontando para turma que nao existe mais
    const alunosDaTurmaRemovida = alunosDaTurma(dados.alunos, id).map((aluno) => aluno.id);

    gravar({
      ...dados,
      turmas: dados.turmas.filter((turma) => turma.id !== id),
      alunos: dados.alunos.filter((aluno) => aluno.turmaId !== id),
      conversas: dados.conversas.filter(
        (conversa) => !alunosDaTurmaRemovida.includes(conversa.alunoId),
      ),
    });
  },

  async listAlunos() {
    return ler().alunos;
  },

  async createAluno(input) {
    const dados = ler();
    if (input.turmaId) {
      if (!dados.turmas.some((turma) => turma.id === input.turmaId)) {
        throw new Error(`Turma nao encontrada: ${input.turmaId}`);
      }
    }

    const aluno: Aluno = { id: gerarId("alu"), ...input } as Aluno;
    gravar({ ...dados, alunos: [...dados.alunos, aluno] });
    return aluno;
  },

  async updateAluno(id, input) {
    const dados = ler();
    const existente = dados.alunos.find((aluno) => aluno.id === id);
    if (!existente) throw new Error(`Aluno nao encontrado: ${id}`);

    const atualizado: Aluno = { ...existente, ...input, id: existente.id };
    gravar({
      ...dados,
      alunos: dados.alunos.map((aluno) => (aluno.id === id ? atualizado : aluno)),
    });
    return atualizado;
  },

  async deleteAluno(id) {
    const dados = ler();
    if (!dados.alunos.some((aluno) => aluno.id === id)) {
      throw new Error(`Aluno nao encontrado: ${id}`);
    }

    gravar({
      ...dados,
      alunos: dados.alunos.filter((aluno) => aluno.id !== id),
      conversas: dados.conversas.filter((conversa) => conversa.alunoId !== id),
    });
  },

  async listConversas() {
    return ler().conversas;
  },

  async upsertConversa(conversa) {
    const dados = ler();
    if (!dados.alunos.some((aluno) => aluno.id === conversa.alunoId)) {
      throw new Error(`Aluno nao encontrado: ${conversa.alunoId}`);
    }

    const existe = dados.conversas.some((item) => item.id === conversa.id);
    gravar({
      ...dados,
      conversas: existe
        ? dados.conversas.map((item) => (item.id === conversa.id ? conversa : item))
        : [...dados.conversas, conversa],
    });
    return conversa;
  },

  async deleteConversa(id) {
    const dados = ler();
    gravar({ ...dados, conversas: dados.conversas.filter((conversa) => conversa.id !== id) });
  },

  async getTeacherName() {
    return ler().teacherName;
  },

  async saveTeacherName(nome) {
    gravar({ ...ler(), teacherName: nome });
  },

  // a partir daqui a API entra: o corpo vira fetch e nada mais no app muda
  async getClassInsights() {
    return {
      alunosComPeiAtivo: 0,
      adaptacoesFeitas: 0,
      resumo: "",
      engajamento: ENGAJAMENTO_ZERADO,
    } satisfies ClassInsights;
  },

  async getStudentInsights() {
    return {
      atividadesAdaptadas: 0,
      engajamento: 0,
      peiGerado: 0,
      resumo: "",
      engajamentoPorMateria: ENGAJAMENTO_ZERADO,
    } satisfies StudentInsights;
  },
};
