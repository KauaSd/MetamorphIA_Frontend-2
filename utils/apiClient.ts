"use client";

export const API_DB_URL = (
  process.env.NEXT_PUBLIC_API_URL ??
  process.env.NEXT_PUBLIC_DB_API_URL ??
  "https://metamorphia-db-api.onrender.com"
).replace(/\/$/, "");

export const API_IA_URL = (
  process.env.NEXT_PUBLIC_IA_API_URL ??
  process.env.NEXT_PUBLIC_AI_API_URL ??
  "https://metamorphia-ia-api.onrender.com"
).replace(/\/$/, "");

export const TOKEN_STORAGE_KEY = "metamorphia:auth:token";
export const REFRESH_TOKEN_STORAGE_KEY = "metamorphia:auth:refresh_token";
export const PENDING_2FA_TOKEN_KEY = "metamorphia:auth:pending_2fa_token";
export const PENDING_RESET_IDENTIFIER_KEY = "metamorphia:auth:pending_reset_identifier";
export const PENDING_RESET_TOKEN_KEY = "metamorphia:auth:pending_reset_token";
export const USER_PROFILE_KEY = "metamorphia:auth:user";
export const AUTH_SESSION_CHANGED_EVENT = "metamorphia:auth-session-changed";

function notificarMudancaSessao(): void {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new Event(AUTH_SESSION_CHANGED_EVENT));
  } catch {}
}

export interface UserPermissoes {
  eh_admin_rede?: boolean;
  pode_alternar_modo_professor?: boolean;
  pode_acessar_painel_adm?: boolean;
  pode_gerenciar_alunos?: boolean;
  pode_gerenciar_turmas?: boolean;
  pode_criar_escolas?: boolean;
  pode_chat?: boolean;
}

export interface UserEscolaMe {
  id_escola: number;
  nome_escola: string;
  plano?: string | null;
  institucional?: boolean;
  codigo_convite?: string | null;
  papel?: "adm" | "professor" | string | null;
}

export interface UserProfile {
  id_usuario: number;
  nome_usuario: string;
  email_usuario?: string | null;
  telefone_usuario?: string | null;
  tipo_usuario?: string;
  modo_ativo?: "adm" | "professor" | string;
  escola_adm_id?: number | null;
  plano?: string;
  id_grupo?: number | null;
  pode_chat?: boolean;
  tags?: string[];
  tags_areas?: string[];
  instrucoes_ia?: string | null;
  nome_real?: string | null;
  perfil_professor_feito?: boolean;
  identificacao_feita?: boolean;
  tutorial_visto?: boolean;
  tutorial_institucional_visto?: boolean;
  escola_institucional?: boolean;
  escolas?: UserEscolaMe[];
  permissoes?: UserPermissoes;
}

export function resolverRotaInicialPosLogin(perfil: UserProfile | null | undefined): string {
  if (!perfil) return "/alunos";
  const tipoNorm = (perfil.tipo_usuario ?? "").trim().toLowerCase();
  const ehAdminRede = Boolean(perfil.permissoes?.eh_admin_rede ?? tipoNorm === "adm_institucional");
  const podePainelAdm = Boolean(
    perfil.permissoes?.pode_acessar_painel_adm ??
      (ehAdminRede || (tipoNorm === "adm_escola" && perfil.modo_ativo !== "professor")),
  );
  const podeChat =
    perfil.permissoes?.pode_chat !== undefined
      ? Boolean(perfil.permissoes.pode_chat)
      : perfil.pode_chat !== undefined
        ? Boolean(perfil.pode_chat)
        : !ehAdminRede;

  if (!podeChat || ehAdminRede || podePainelAdm) {
    return "/escolas";
  }
  return "/alunos";
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
  } catch {}
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setRefreshToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
    }
  } catch {}
}

export function setAuthTokens(
  accessToken: string,
  refreshToken?: string | null,
): void {
  setAuthToken(accessToken);
  if (refreshToken !== undefined) {
    setRefreshToken(refreshToken);
  }
  notificarMudancaSessao();
}

export function getPending2FAToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(PENDING_2FA_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setPending2FAToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      window.sessionStorage.setItem(PENDING_2FA_TOKEN_KEY, token);
    } else {
      window.sessionStorage.removeItem(PENDING_2FA_TOKEN_KEY);
    }
  } catch {}
}

export function getSavedUserProfile(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(USER_PROFILE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

export function setSavedUserProfile(profile: UserProfile | null): void {
  if (typeof window === "undefined") return;
  try {
    if (profile) {
      window.localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
    } else {
      window.localStorage.removeItem(USER_PROFILE_KEY);
    }
  } catch {}
}

export function getPendingResetIdentifier(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(PENDING_RESET_IDENTIFIER_KEY);
  } catch {
    return null;
  }
}

export function setPendingResetIdentifier(identificador: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (identificador) {
      window.sessionStorage.setItem(PENDING_RESET_IDENTIFIER_KEY, identificador);
    } else {
      window.sessionStorage.removeItem(PENDING_RESET_IDENTIFIER_KEY);
    }
  } catch {}
}

export function getPendingResetToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(PENDING_RESET_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setPendingResetToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      window.sessionStorage.setItem(PENDING_RESET_TOKEN_KEY, token);
    } else {
      window.sessionStorage.removeItem(PENDING_RESET_TOKEN_KEY);
    }
  } catch {}
}

export function clearAuthSession(): void {
  setAuthToken(null);
  setRefreshToken(null);
  setPending2FAToken(null);
  setPendingResetIdentifier(null);
  setPendingResetToken(null);
  setSavedUserProfile(null);
  if (typeof window !== "undefined") {
    try {
      for (const storage of [window.localStorage, window.sessionStorage]) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < storage.length; i += 1) {
          const key = storage.key(i);
          if (key && key.startsWith("metamorphia:")) {
            keysToRemove.push(key);
          }
        }
        for (const key of keysToRemove) {
          storage.removeItem(key);
        }
      }
    } catch {}
  }
  notificarMudancaSessao();
}

export function parseNumeroId(id: string | number | null | undefined): number | null {
  if (typeof id === "number" && Number.isFinite(id)) return id;
  if (!id) return null;
  const texto = String(id).trim();
  if (/^\d+$/.test(texto)) return Number(texto);
  const match = /(\d+)$/.exec(texto);
  if (match) return Number(match[1]);
  return null;
}

export function montarHeadersJson(tokenOverride?: string | null): Record<string, string> {
  const token = tokenOverride !== undefined ? tokenOverride : getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

const ROTAS_SEM_REFRESH = [
  "/autenticar/login",
  "/autenticar/cadastro",
  "/autenticar/refresh",
  "/autenticar/google",
  "/autenticar/microsoft",
  "/autenticar/recuperar-senha",
  "/autenticar/verificar-codigo-senha",
  "/autenticar/redefinir-senha",
];

function tokenEstaExpirando(token: string, margemSegundos = 60): boolean {
  try {
    const partes = token.split(".");
    if (partes.length < 2) return false;
    const base64 = partes[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64)) as { exp?: number };
    if (typeof payload.exp !== "number") return false;
    const agoraSegundos = Math.floor(Date.now() / 1000);
    return payload.exp - agoraSegundos <= margemSegundos;
  } catch {
    return false;
  }
}

let refreshEmAndamento: Promise<string | null> | null = null;

/**
 * Renova o access_token (e rotaciona o refresh_token) via POST /autenticar/refresh.
 * Requisicoes paralelas compartilham a mesma chamada para evitar corrida na rotacao.
 */
export async function renovarTokenJwt(): Promise<string | null> {
  if (refreshEmAndamento) return refreshEmAndamento;

  refreshEmAndamento = (async () => {
    const refreshToken = getRefreshToken();
    try {
      const resp = await fetch(`${API_DB_URL}/autenticar/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(refreshToken ? { refresh_token: refreshToken } : {}),
      });

      if (!resp.ok) {
        clearAuthSession();
        return null;
      }

      const dados = (await resp.json()) as {
        access_token?: string;
        refresh_token?: string | null;
      };
      if (!dados.access_token) {
        clearAuthSession();
        return null;
      }

      setAuthToken(dados.access_token);
      if (dados.refresh_token) {
        setRefreshToken(dados.refresh_token);
      }
      return dados.access_token;
    } catch {
      return null;
    } finally {
      refreshEmAndamento = null;
    }
  })();

  return refreshEmAndamento;
}

function executarFetchComBase(
  baseUrl: string,
  endpoint: string,
  init: RequestInit,
  token: string | null,
): Promise<Response> {
  const headers = new Headers(init.headers ?? {});
  if (
    !headers.has("Content-Type") &&
    !(init.body instanceof FormData) &&
    !(init.body instanceof URLSearchParams)
  ) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return fetch(`${baseUrl}${endpoint}`, {
    ...init,
    headers,
  });
}

async function apiFetchComBase(
  baseUrl: string,
  endpoint: string,
  init: RequestInit = {},
  tokenOverride?: string | null,
): Promise<Response> {
  const permiteRefresh =
    tokenOverride === undefined &&
    !ROTAS_SEM_REFRESH.some((rota) => endpoint.startsWith(rota));

  let token = tokenOverride !== undefined ? tokenOverride : getAuthToken();

  // Renovacao preventiva se o JWT ja estiver expirado ou a menos de 60s de expirar
  if (permiteRefresh && token && tokenEstaExpirando(token) && getRefreshToken()) {
    const renovado = await renovarTokenJwt();
    if (renovado) token = renovado;
  }

  let resp = await executarFetchComBase(baseUrl, endpoint, init, token);

  // Se a API responder 401, tenta renovar o JWT uma vez e refaz a requisicao
  if (resp.status === 401 && permiteRefresh) {
    const renovado = getRefreshToken() ? await renovarTokenJwt() : null;
    if (renovado) {
      resp = await executarFetchComBase(baseUrl, endpoint, init, renovado);
    } else {
      setAuthToken(null);
      setRefreshToken(null);
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/auth/")
      ) {
        window.location.href = "/auth/login";
      }
    }
  }

  return resp;
}

export async function apiDbFetch(
  endpoint: string,
  init: RequestInit = {},
  tokenOverride?: string | null,
): Promise<Response> {
  return apiFetchComBase(API_DB_URL, endpoint, init, tokenOverride);
}

export async function apiIaFetch(
  endpoint: string,
  init: RequestInit = {},
  tokenOverride?: string | null,
): Promise<Response> {
  return apiFetchComBase(API_IA_URL, endpoint, init, tokenOverride);
}

/**
 * Executa a chamada diretamente na API da IA (`API_IA_URL`) quando configurada,
 * com fallback para o Gateway da API principal (`/AI/...`).
 */
export async function apiAiGatewayOrDirect(
  dbEndpoint: string,
  iaEndpoint: string,
  init: RequestInit = {},
): Promise<Response> {
  if (API_IA_URL) {
    return apiIaFetch(iaEndpoint, init);
  }
  return apiDbFetch(dbEndpoint, init);
}

export function baixarArquivoDeAnexo(anexo: {
  name: string;
  dataUrl?: string;
  type?: string;
}): void {
  if (typeof window === "undefined" || !anexo.dataUrl) return;
  const link = document.createElement("a");
  link.href = anexo.dataUrl;
  link.download = anexo.name || "documento_adaptado.docx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
