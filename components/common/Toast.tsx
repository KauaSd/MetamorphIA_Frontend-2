"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import Alert from "@/components/common/alert";
import type { MensagemAlerta } from "@/utils/alertas";

// tempos do toast em ms
const TOAST_MS = 5000;
const TOAST_SAIDA_MS = 250;

/**
 * Estado de um alerta de tela. `mostrar` recebe a mensagem, `limpar` fecha.
 */
export function useAlerta() {
  const [alerta, setAlerta] = useState<MensagemAlerta | null>(null);

  const mostrar = useCallback((mensagem: MensagemAlerta) => {
    setAlerta(mensagem);
  }, []);

  const limpar = useCallback(() => {
    setAlerta(null);
  }, []);

  return { alerta, mostrar, limpar };
}

interface ToastProps {
  alerta: MensagemAlerta;
  /** aceita tanto um setState quanto um `() => void` */
  limpar: (valor: MensagemAlerta | null) => void;
}

/**
 * Toast fixo no rodape da tela, que some sozinho.
 *
 * O callback fica num ref para que o timer dependa so do alerta: um
 * `limpar` recriado a cada render nao reiniciaria a contagem.
 */
export default function Toast({ alerta, limpar }: ToastProps) {
  const [saindo, setSaindo] = useState(false);
  const fecharRef = useRef(limpar);

  useEffect(() => {
    fecharRef.current = limpar;
  }, [limpar]);

  useEffect(() => {
    const comecarSaida = setTimeout(() => setSaindo(true), TOAST_MS);
    // desmonta depois da animacao de saida terminar
    const desmontar = setTimeout(() => fecharRef.current(null), TOAST_MS + TOAST_SAIDA_MS);

    return () => {
      clearTimeout(comecarSaida);
      clearTimeout(desmontar);
    };
  }, [alerta]);

  return (
    // container do toast, o role="alert" fica no proprio Alert
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-110 flex justify-center px-3">
      <div
        className={twMerge(
          "pointer-events-auto motion-reduce:animate-none",
          saindo
            ? "animate-[alert-sair_250ms_cubic-bezier(0.4,0,1,1)_forwards]"
            : "animate-[alert-entrar_350ms_cubic-bezier(0.16,1,0.3,1)]",
        )}
      >
        <Alert {...alerta} />
      </div>
    </div>
  );
}