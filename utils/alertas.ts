// tons possiveis de um alerta, tambem usados pelo componente Alert
export type TomAlerta = "danger" | "warning" | "success" | "info";

// formato de uma mensagem de alerta
export interface MensagemAlerta {
  tom: TomAlerta;
  titulo: string;
  descricao?: string;
  itens?: string[];
}

// catalogo de mensagens, consumido pelos formularios de auth e pelo chat
export const ALERTAS = {
  LOGIN_SEM_IDENTIFICADOR: {
    tom: "danger",
    titulo: "Campo obrigatório",
    descricao: "Digite seu telefone ou e-mail para entrar.",
  },
  LOGIN_SEM_SENHA: {
    tom: "danger",
    titulo: "Campo obrigatório",
    descricao: "Digite sua senha para entrar.",
  },
  LOGIN_INVALIDO: {
    tom: "danger",
    titulo: "E-mail ou telefone inválido",
    descricao: "Verifique os dados e tente novamente.",
  },
  CAD_NOME_VAZIO: {
    tom: "danger",
    titulo: "Campo obrigatório",
    descricao: "Digite seu nome completo.",
  },
  CAD_TEL_VAZIO: {
    tom: "danger",
    titulo: "Campo obrigatório",
    descricao: "Digite seu telefone.",
  },
  CAD_TEL_INVALIDO: {
    tom: "danger",
    titulo: "Telefone inválido",
    descricao: "Verifique o número e tente novamente.",
  },
  CAD_EMAIL_VAZIO: {
    tom: "danger",
    titulo: "Campo obrigatório",
    descricao: "Digite seu e-mail.",
  },
  CAD_EMAIL_INVALIDO: {
    tom: "danger",
    titulo: "E-mail inválido",
    descricao: "Verifique o e-mail e tente novamente.",
  },
  CAD_SENHA_VAZIO: {
    tom: "danger",
    titulo: "Campo obrigatório",
    descricao: "Digite sua senha.",
  },
  CAD_TERMOS: {
    tom: "danger",
    titulo: "Aceite os termos",
    descricao: "É necessário aceitar os termos para continuar.",
  },
  RECUPERA_VAZIO: {
    tom: "danger",
    titulo: "Campo obrigatório",
    descricao: "Digite seu e-mail ou telefone.",
  },
  RECUPERA_INVALIDO: {
    tom: "danger",
    titulo: "E-mail ou telefone inválido",
    descricao: "Verifique os dados e tente novamente.",
  },
  TOKEN_INCOMPLETO: {
    tom: "danger",
    titulo: "Código incompleto",
    descricao: "Digite os 6 dígitos do código.",
  },
  TURMA_NOME_VAZIO: {
    tom: "danger",
    titulo: "Informe o nome da turma",
  },
  TURMA_NAO_ENCONTRADA: {
    tom: "danger",
    titulo: "Turma não encontrada",
  },
  ALUNO_NOME_VAZIO: {
    tom: "danger",
    titulo: "Informe o nome do aluno",
  },
  ALUNO_NAO_ENCONTRADO: {
    tom: "danger",
    titulo: "Aluno não encontrado",
  },
  CONVERSA_JA_EXISTE: {
    tom: "warning",
    titulo: "Já existe uma conversa com esse aluno",
  },
  TEXTO_VAZIO: {
    tom: "danger",
    titulo: "Digite uma mensagem",
  },
  CONVERSA_NAO_ENCONTRADA: {
    tom: "danger",
    titulo: "Conversa não encontrada",
  },
  DADOS_INVALIDOS: {
    tom: "danger",
    titulo: "Dados inválidos",
  },
  ERRO_GERAL: {
    tom: "danger",
    titulo: "Algo deu errado",
  },
} as const;

export const ALERTAS_ADICIONAIS = {
  ERRO_CONEXAO: { tom: "danger" as const, titulo: "Erro de conexão" },
  CHAT_IA_FALHOU: { tom: "danger" as const, titulo: "Erro ao obter resposta" },
  SUCESSO_CADASTRO: { tom: "success" as const, titulo: "Cadastro realizado" },
};
