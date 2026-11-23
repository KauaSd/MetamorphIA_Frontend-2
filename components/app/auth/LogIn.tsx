"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Microsoft from "@/public/iconeMicrosoft.svg";
import Google from "@/public/iconeGoogle.svg";
import Toast from "@/components/common/Toast";
import { BarraCarregando } from "@/components/common/Carregando";
import type { MensagemAlerta } from "@/utils/alertas";
import {
  apiDbFetch,
  setAuthTokens,
  setSavedUserProfile,
} from "@/utils/apiClient";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
const MICROSOFT_CLIENT_ID = process.env.NEXT_PUBLIC_MICROSOFT_CLIENT_ID ?? "";

function abrirPopupOAuth(url: string, nome: string): Promise<URLSearchParams | null> {
  return new Promise((resolve) => {
    const width = 500;
    const height = 620;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    const popup = window.open(
      url,
      nome,
      `width=${width},height=${height},left=${left},top=${top}`,
    );

    if (!popup) {
      resolve(null);
      return;
    }

    const timer = window.setInterval(() => {
      if (popup.closed) {
        window.clearInterval(timer);
        resolve(null);
        return;
      }
      try {
        if (popup.location.origin === window.location.origin) {
          const hash = popup.location.hash.replace(/^#/, "");
          const search = popup.location.search.replace(/^\?/, "");
          const params = new URLSearchParams(hash || search);
          if (params.get("id_token") || params.get("access_token") || params.get("error")) {
            window.clearInterval(timer);
            popup.close();
            resolve(params);
          }
        }
      } catch {
        // Ainda no domínio do provedor OAuth
      }
    }, 300);
  });
}

export default function LogIn() {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [alerta, setAlerta] = useState<MensagemAlerta | null>(null);

  async function finalizarSessaoSocial(accessToken: string, refreshToken?: string | null) {
    setAuthTokens(accessToken, refreshToken);
    try {
      const meResp = await apiDbFetch("/autenticar/me", {}, accessToken);
      if (meResp.ok) {
        const me = await meResp.json();
        setSavedUserProfile(me);
      }
    } catch {}
    router.push("/alunos");
  }

  async function autenticarGoogle() {
    if (carregando) return;
    if (!GOOGLE_CLIENT_ID) {
      setAlerta({
        tom: "info",
        titulo: "Login com Google",
        descricao: "Configure NEXT_PUBLIC_GOOGLE_CLIENT_ID no ambiente para ativar o OAuth do Google.",
      });
      return;
    }

    setCarregando(true);
    try {
      const redirectUri = `${window.location.origin}/auth/login`;
      const nonce = `${Date.now()}`;
      const authUrl =
        `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=id_token&scope=openid%20email%20profile&nonce=${nonce}`;

      const params = await abrirPopupOAuth(authUrl, "google-oauth");
      const idToken = params?.get("id_token");
      if (!idToken) {
        setCarregando(false);
        return;
      }

      const resp = await apiDbFetch("/autenticar/google", {
        method: "POST",
        body: JSON.stringify({ id_token: idToken }),
      });
      if (!resp.ok) {
        const erroJson = (await resp.json().catch(() => ({}))) as { detail?: string };
        setAlerta({
          tom: "danger",
          titulo: "Falha ao entrar com Google",
          descricao: erroJson.detail || "Não foi possível validar sua conta Google.",
        });
        setCarregando(false);
        return;
      }

      const dados = (await resp.json()) as {
        access_token: string;
        refresh_token?: string | null;
      };
      await finalizarSessaoSocial(dados.access_token, dados.refresh_token);
    } catch {
      setAlerta({
        tom: "danger",
        titulo: "Erro de conexão",
        descricao: "Não foi possível autenticar com o Google.",
      });
      setCarregando(false);
    }
  }

  async function autenticarMicrosoft() {
    if (carregando) return;
    if (!MICROSOFT_CLIENT_ID) {
      setAlerta({
        tom: "info",
        titulo: "Login com Microsoft",
        descricao: "Configure NEXT_PUBLIC_MICROSOFT_CLIENT_ID no ambiente para ativar o OAuth da Microsoft.",
      });
      return;
    }

    setCarregando(true);
    try {
      const redirectUri = `${window.location.origin}/auth/login`;
      const nonce = `${Date.now()}`;
      const authUrl =
        `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${encodeURIComponent(MICROSOFT_CLIENT_ID)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=id_token%20token&response_mode=fragment&scope=openid%20email%20profile%20User.Read&nonce=${nonce}`;

      const params = await abrirPopupOAuth(authUrl, "microsoft-oauth");
      const idToken = params?.get("id_token");
      const accessToken = params?.get("access_token");
      if (!idToken && !accessToken) {
        setCarregando(false);
        return;
      }

      const resp = await apiDbFetch("/autenticar/microsoft", {
        method: "POST",
        body: JSON.stringify({
          ...(idToken ? { id_token: idToken } : {}),
          ...(accessToken ? { access_token: accessToken } : {}),
        }),
      });
      if (!resp.ok) {
        const erroJson = (await resp.json().catch(() => ({}))) as { detail?: string };
        setAlerta({
          tom: "danger",
          titulo: "Falha ao entrar com Microsoft",
          descricao: erroJson.detail || "Não foi possível validar sua conta Microsoft.",
        });
        setCarregando(false);
        return;
      }

      const dados = (await resp.json()) as {
        access_token: string;
        refresh_token?: string | null;
      };
      await finalizarSessaoSocial(dados.access_token, dados.refresh_token);
    } catch {
      setAlerta({
        tom: "danger",
        titulo: "Erro de conexão",
        descricao: "Não foi possível autenticar com a Microsoft.",
      });
      setCarregando(false);
    }
  }

  return (
    <div className="mx-auto mt-6 w-full max-w-md px-4 sm:mt-7 sm:px-0">
      {alerta ? (
        <Toast
          key={`${alerta.titulo}-${alerta.descricao ?? ""}`}
          alerta={alerta}
          limpar={setAlerta}
        />
      ) : null}

      <div className="flex items-center justify-center gap-3 sm:gap-6">
        <div className="h-px flex-1 bg-secondary" />
        <p className="text-sm text-secondary">ou</p>
        <div className="h-px flex-1 bg-secondary" />
      </div>

      {carregando ? (
        <div className="mt-4 flex justify-center">
          <BarraCarregando className="w-36" />
        </div>
      ) : (
        <div className="mt-2 flex flex-row justify-center gap-2">
          <button
            type="button"
            onClick={() => void autenticarGoogle()}
            className="cursor-pointer rounded-full transition-transform hover:scale-105"
            aria-label="Entrar com Google"
          >
            <img src={Google.src} alt="Entrar com Google" />
          </button>
          <button
            type="button"
            onClick={() => void autenticarMicrosoft()}
            className="cursor-pointer rounded-full transition-transform hover:scale-105"
            aria-label="Entrar com Microsoft"
          >
            <img src={Microsoft.src} alt="Entrar com Microsoft" />
          </button>
        </div>
      )}
    </div>
  );
}
