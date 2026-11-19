"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import Planos from "@/components/public/Planos";

export default function PlanosPage() {
  const router = useRouter();

  const handleClose = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/alunos");
    }
  };

  return (
    <div className="relative flex h-auto w-full items-center justify-center bg-surface-muted px-6 py-16 lg:h-full lg:py-0">
      <button
        type="button"
        aria-label="Fechar"
        onClick={handleClose}
        className="absolute top-6 left-6 cursor-pointer hover:text-secondary"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="flex w-full max-w-[1200px] flex-col items-center gap-6 lg:grid lg:grid-cols-3 lg:items-stretch lg:gap-8">
        <Planos tipo="basico" className="min-h-0 md:w-full" />
        <Planos tipo="pro" className="min-h-0 md:w-full" />
        <Planos tipo="institucional" className="min-h-0 md:w-full" />
      </div>
    </div>
  );
}
