"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Blurfundo from "@/components/common/Blurfundo";
import Button from "@/components/common/Button";
import { OverlayCarregando } from "@/components/common/Carregando";
import Input from "@/components/common/Input";
import Toast, { useAlerta } from "@/components/common/Toast";
import { parseNumeroId } from "@/utils/apiClient";
import {
  aceitarConviteEscola,
  buscarDetalheConvite,
  recusarConviteEscola,
} from "@/utils/data/apiRepository";

interface FormVincularInstituicaoProps {
  conviteId?: string;
  nomeInstituicao?: string;
  codigoInicial?: string;
  onClose: () => void;
  onSucesso?: () => Promise<void>;
}

export default function FormVincularInstituicao({
  conviteId,
  nomeInstituicao,
  codigoInicial = "",
  onClose,
  onSucesso,
}: FormVincularInstituicaoProps) {
  const [codigo, setCodigo] = useState(codigoInicial);
  const [naoFazParte, setNaoFazParte] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [nomeEscolaApi, setNomeEscolaApi] = useState<string | null>(null);
  const { alerta, mostrar, limpar } = useAlerta();

  const conviteNumId = conviteId ? parseNumeroId(conviteId) : null;

  useEffect(() => {
    if (conviteNumId === null) return;
    const controller = new AbortController();
    buscarDetalheConvite(conviteNumId, controller.signal).then((detalhe) => {
      if (detalhe?.nome_escola) {
        setNomeEscolaApi(detalhe.nome_escola);
      }
    });
    return () => controller.abort();
  }, [conviteNumId]);

  const nomeExibicao = nomeEscolaApi || nomeInstituicao?.trim() || "a instituição";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (enviando) return;

    if (naoFazParte) {
      if (conviteNumId !== null) {
        setEnviando(true);
        try {
          await recusarConviteEscola(conviteNumId);
        } catch (err) {
          mostrar({
            tom: "danger",
            titulo: "Não foi possível recusar",
            descricao:
              err instanceof Error ? err.message : "Tente novamente mais tarde.",
          });
          setEnviando(false);
          return;
        }
      }
      onClose();
      return;
    }

    const codigoLimpo = codigo.trim();
    if (!codigoLimpo) {
      mostrar({
        tom: "danger",
        titulo: "Código obrigatório",
        descricao: "Informe o código fornecido pela instituição.",
      });
      return;
    }

    setEnviando(true);
    try {
      await aceitarConviteEscola({
        codigo_convite: codigoLimpo,
        id_convite: conviteNumId,
      });
      await onSucesso?.();
      onClose();
    } catch (err) {
      mostrar({
        tom: "danger",
        titulo: "Não foi possível vincular",
        descricao:
          err instanceof Error
            ? err.message
            : "Verifique o código informado e tente novamente.",
      });
      setEnviando(false);
    }
  }

  return (
    <Blurfundo onClose={enviando ? undefined : onClose}>
      <form
        onSubmit={handleSubmit}
        className="fixed inset-0 z-50 h-dvh w-screen sm:static sm:h-auto sm:w-full sm:max-w-md"
      >
        {alerta ? <Toast alerta={alerta} limpar={limpar} /> : null}

        <div className="relative flex h-full w-full flex-col gap-5 rounded-none bg-surface-base p-6 sm:h-auto sm:rounded-[50px] sm:p-8">
          <OverlayCarregando ativo={enviando} mensagem="Vinculando..." />

          <div className="flex items-center justify-between">
            <h2 className="font-(family-name:--font-text-me-one) text-3xl text-primary sm:text-4xl">
              Vincular à instituição
            </h2>
            <button
              type="button"
              aria-label="Fechar"
              disabled={enviando}
              onClick={onClose}
              className="cursor-pointer disabled:opacity-50"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <p className="text-sm leading-relaxed text-secondary">
            A instituição {nomeExibicao} convida você a participar do plano Institucional. Para
            entrar, insira o código fornecido por ela.
          </p>

          <Input
            type="text"
            placeholder="Digite o código"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            disabled={enviando || naoFazParte}
          />

          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-primary select-none">
            <input
              type="checkbox"
              checked={naoFazParte}
              onChange={(e) => setNaoFazParte(e.target.checked)}
              disabled={enviando}
              className="h-4 w-4 cursor-pointer rounded border border-secondary accent-surface-accent"
            />
            <span>Eu não faço parte dessa instituição.</span>
          </label>

          <div className="mt-auto flex justify-center gap-4 sm:mt-2">
            <Button
              type="button"
              onClick={onClose}
              disabled={enviando}
              className="bg-surface-inverse text-inverse hover:bg-surface-inverse-hover sm:w-auto sm:px-7"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={enviando} className="sm:w-auto sm:px-8">
              Entrar
            </Button>
          </div>
        </div>
      </form>
    </Blurfundo>
  );
}
