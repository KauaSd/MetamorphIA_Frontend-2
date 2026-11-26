import {
  apiAiGatewayOrDirect,
  apiDbFetch,
  baixarArquivoDeAnexo,
  parseNumeroId,
} from "@/utils/apiClient";
import type { Aluno, AnexoMensagem } from "@/utils/data/types";
import type { Answer, Question } from "@/utils/pei/types";
import { letraDaOpcao } from "@/utils/pei/types";

export interface PeiGeradoResultado {
  peiId: string;
  documentoGerado: string;
  arquivoNome: string;
  anexo?: AnexoMensagem;
}

export interface PeiService {
  buscarPerguntas(ctx: {
    aluno: Aluno;
    componente: string;
    periodo: string;
    descricaoAluno?: string;
  }): Promise<Question[]>;
  gerarPeiDocumento(ctx: {
    aluno: Aluno;
    professor?: string;
    componente: string;
    periodo: string;
    questions: Question[];
    respostas: Record<string, Answer>;
  }): Promise<PeiGeradoResultado | null>;
  importarPeiArquivo(ctx: {
    aluno: Aluno;
    arquivo: File;
    componente?: string;
    periodo?: string;
  }): Promise<PeiGeradoResultado>;
  baixarUltimoPeiAluno(aluno: Aluno): Promise<boolean>;
}

function extrairBimestre(periodo: string): number {
  const match = /(\d)/.exec(periodo);
  if (match) {
    const n = Number(match[1]);
    if (n >= 1 && n <= 4) return n;
  }
  return 1;
}

interface ApiPeiSubpergunta {
  id_subpergunta: string;
  pergunta: string;
  opcoes: string[];
}

interface ApiPeiPerguntaGeral {
  numero: number;
  pergunta_geral: string;
  subperguntas: ApiPeiSubpergunta[];
}

function converterRoteiroApiParaQuestions(perguntasApi: ApiPeiPerguntaGeral[]): Question[] {
  const lista = perguntasApi.flatMap((grupo, gIdx) =>
    (grupo.subperguntas ?? []).map((sub, sIdx) => ({
      id: sub.id_subpergunta || `q${gIdx + 1}s${sIdx + 1}`,
      text: sub.pergunta,
      parentText: grupo.pergunta_geral,
      parentOrder: grupo.numero || gIdx + 1,
      selectionMode: "single" as const,
      options: (sub.opcoes ?? []).slice(0, 4).map((opTexto, oIdx) => ({
        id: `q${gIdx + 1}s${sIdx + 1}o${oIdx + 1}`,
        text: opTexto || `Opção ${letraDaOpcao(oIdx)}`,
      })),
    })),
  );

  return lista.map((item, idx) => ({
    ...item,
    order: idx + 1,
    hasNext: idx < lista.length - 1,
  }));
}

export const peiService: PeiService = {
  async buscarPerguntas({ aluno, componente, periodo, descricaoAluno }): Promise<Question[]> {
    const numId = parseNumeroId(aluno.id);
    if (numId === null) {
      throw new Error("ID do aluno inválido para gerar perguntas do PEI.");
    }

    const bimestre = extrairBimestre(periodo);
    const descricao =
      descricaoAluno ||
      aluno.descricao ||
      `Estudante ${aluno.nome}, idade ${aluno.idade ?? "não informada"}, perfil ${aluno.neuro.join(", ") || "inclusão escolar"}.`;

    const resp = await apiAiGatewayOrDirect(
      `/AI/pei/aluno/${numId}/inicial`,
      `/alunos/${numId}/pei/inicial`,
      {
        method: "POST",
        body: JSON.stringify({
          descricao_aluno: descricao,
          componente_curricular: componente || "Língua Portuguesa",
          periodo_bimestre: bimestre,
        }),
      },
    );

    if (!resp.ok) {
      throw new Error(`Falha ao buscar perguntas do PEI (HTTP ${resp.status}).`);
    }

    const dados = (await resp.json()) as {
      perguntas?: ApiPeiPerguntaGeral[];
    };
    const convertidas = Array.isArray(dados.perguntas)
      ? converterRoteiroApiParaQuestions(dados.perguntas)
      : [];

    if (convertidas.length === 0) {
      throw new Error("A API não retornou perguntas para o PEI.");
    }

    return convertidas;
  },

  async gerarPeiDocumento({
    aluno,
    professor,
    componente,
    periodo,
    questions,
    respostas,
  }): Promise<PeiGeradoResultado | null> {
    const numId = parseNumeroId(aluno.id);
    if (numId === null) return null;

    const bimestre = extrairBimestre(periodo);
    const itensRespostas = questions.map((q) => {
      const resp = respostas[q.id];
      const opcoesEscolhidas = q.options
        .filter((op) => resp?.selectedOptionIds.includes(op.id))
        .map((op) => op.text);
      const textoLivre = resp?.freeText?.trim();
      const partes = [...opcoesEscolhidas, ...(textoLivre ? [textoLivre] : [])];
      return {
        pergunta: q.text,
        resposta: partes.join(" | ") || "Conforme planejamento pedagógico do bimestre.",
        numero_pergunta_geral: q.parentOrder ?? 1,
      };
    });

    const resp = await apiAiGatewayOrDirect(`/AI/pei/aluno/${numId}`, `/alunos/${numId}/pei`, {
      method: "POST",
      body: JSON.stringify({
        nome_professor_regente: professor || "Professor(a)",
        componente_curricular: componente || "Língua Portuguesa",
        periodo_bimestre: bimestre,
        respostas: itensRespostas,
      }),
    });

    if (!resp.ok) return null;

    const dados = (await resp.json()) as {
      pei_id: string;
      documento_gerado: string;
      arquivo_nome?: string;
      documento_docx_base64?: string;
    };
    const arquivoNome =
      dados.arquivo_nome || `PEI_${aluno.nome.replace(/\s+/g, "_")}_${bimestre}Bim_2026.docx`;
    const b64 = dados.documento_docx_base64;
    const anexo: AnexoMensagem | undefined = b64
      ? {
          name: arquivoNome,
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          size: Math.round((b64.length * 3) / 4),
          dataUrl: `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${b64}`,
        }
      : undefined;

    return {
      peiId: dados.pei_id,
      documentoGerado: dados.documento_gerado,
      arquivoNome,
      anexo,
    };
  },

  async importarPeiArquivo({
    aluno,
    arquivo,
    componente,
    periodo,
  }): Promise<PeiGeradoResultado> {
    const numId = parseNumeroId(aluno.id);
    if (numId === null) {
      throw new Error("ID do aluno inválido para importar PEI.");
    }

    const dataUrl = await new Promise<string>((resolver, rejeitar) => {
      const leitor = new FileReader();
      leitor.onload = () => resolver(String(leitor.result));
      leitor.onerror = () => rejeitar(new Error("Falha ao ler arquivo"));
      leitor.readAsDataURL(arquivo);
    });

    const bimestre = extrairBimestre(periodo || "1");
    const resp = await apiAiGatewayOrDirect(
      `/AI/pei/aluno/${numId}/importar`,
      `/alunos/${numId}/pei/importar`,
      {
        method: "POST",
        body: JSON.stringify({
          arquivo_nome: arquivo.name,
          arquivo_base64: dataUrl,
          componente_curricular: componente || "Língua Portuguesa",
          periodo_bimestre: bimestre,
        }),
      },
    );

    if (!resp.ok) {
      throw new Error(`Não foi possível importar o PEI (HTTP ${resp.status}).`);
    }

    const dados = (await resp.json()) as {
      pei_id: string;
      documento_gerado: string;
      arquivo_nome?: string;
      documento_docx_base64?: string;
    };
    const arquivoNome = dados.arquivo_nome || arquivo.name;
    const b64 = dados.documento_docx_base64;
    const anexo: AnexoMensagem = b64
      ? {
          name: arquivoNome,
          type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          size: Math.round((b64.length * 3) / 4),
          dataUrl: `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${b64}`,
        }
      : {
          name: arquivo.name,
          type: arquivo.type || "application/octet-stream",
          size: arquivo.size,
          dataUrl,
        };

    return {
      peiId: dados.pei_id,
      documentoGerado: dados.documento_gerado,
      arquivoNome,
      anexo,
    };
  },

  async baixarUltimoPeiAluno(aluno: Aluno): Promise<boolean> {
    const numId = parseNumeroId(aluno.id);
    if (numId === null) return false;

    const respLista = await apiAiGatewayOrDirect(
      `/AI/pei/aluno/${numId}`,
      `/alunos/${numId}/pei`,
    );
    if (!respLista.ok) return false;

    const lista = (await respLista.json()) as Array<{ pei_id: string }>;
    if (!Array.isArray(lista) || lista.length === 0) return false;

    const peiId = lista[0].pei_id;
    const respDoc = await apiAiGatewayOrDirect(
      `/AI/pei/aluno/${numId}/${peiId}/docx`,
      `/alunos/${numId}/pei/${peiId}/docx`,
    );
    if (!respDoc.ok) return false;

    const blob = await respDoc.blob();
    const url = URL.createObjectURL(blob);
    baixarArquivoDeAnexo({
      name: `PEI_${aluno.nome.replace(/\s+/g, "_")}.docx`,
      dataUrl: url,
    });
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    return true;
  },
};

export async function baixarPeiAlunoPorFiltro(
  aluno: Aluno,
  opcoes?: { bimestre?: string; disciplina?: string },
): Promise<boolean> {
  const numId = parseNumeroId(aluno.id);
  if (numId === null) return false;

  const respLista = await apiAiGatewayOrDirect(
    `/AI/pei/aluno/${numId}`,
    `/alunos/${numId}/pei`,
  );
  if (!respLista.ok) return false;

  const lista = (await respLista.json()) as Array<{
    pei_id: string;
    arquivo_nome?: string | null;
    bimestre?: string | number | null;
    periodo?: string | null;
    componente?: string | null;
    disciplina?: string | null;
  }>;
  if (!Array.isArray(lista) || lista.length === 0) return false;

  const bimNum = opcoes?.bimestre ? extrairBimestre(opcoes.bimestre) : null;
  const discNorm = (opcoes?.disciplina ?? "").trim().toLowerCase();
  const filtrarDisc = discNorm && !discNorm.includes("todas");

  const correspondente =
    lista.find((item) => {
      const itemBim =
        item.bimestre != null
          ? Number(item.bimestre)
          : item.periodo
            ? extrairBimestre(item.periodo)
            : null;
      const itemDisc = (item.disciplina ?? item.componente ?? "").trim().toLowerCase();
      const bateBim = !bimNum || itemBim === null || itemBim === bimNum;
      const bateDisc = !filtrarDisc || !itemDisc || itemDisc.includes(discNorm);
      return bateBim && bateDisc;
    }) ?? lista[0];

  const peiId = correspondente.pei_id;
  const respDoc = await apiAiGatewayOrDirect(
    `/AI/pei/aluno/${numId}/${peiId}/docx`,
    `/alunos/${numId}/pei/${peiId}/docx`,
  );
  if (!respDoc.ok) return false;

  const blob = await respDoc.blob();
  const url = URL.createObjectURL(blob);
  const nomeArquivo =
    correspondente.arquivo_nome || `PEI_${aluno.nome.replace(/\s+/g, "_")}.docx`;
  baixarArquivoDeAnexo({
    name: nomeArquivo,
    dataUrl: url,
  });
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  return true;
}

export async function baixarPeisTurmaZip(
  escolaId: string | undefined,
  turmaId: string,
  turmaNome?: string,
): Promise<{ ok: boolean; erro?: string }> {
  const numTurma = parseNumeroId(turmaId);
  const numEscola = parseNumeroId(escolaId ?? "");
  if (numTurma === null || numEscola === null) {
    return { ok: false, erro: "Turma ou escola inválida para exportação." };
  }

  const resp = await apiDbFetch(`/escolas/${numEscola}/turmas/${numTurma}/peis/download`);
  if (!resp.ok) {
    const corpo = (await resp.json().catch(() => ({}))) as { detail?: string };
    return {
      ok: false,
      erro: corpo.detail || "Nenhum PEI disponível para download nesta turma.",
    };
  }

  const blob = await resp.blob();
  const url = URL.createObjectURL(blob);
  const nomeBase = (turmaNome || `turma_${numTurma}`).replace(/\s+/g, "_");
  baixarArquivoDeAnexo({
    name: `PEIs_${nomeBase}.zip`,
    dataUrl: url,
  });
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  return { ok: true };
}
