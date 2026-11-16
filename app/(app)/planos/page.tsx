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
    <div className="relative flex h-full w-full items-center justify-center bg-surface-muted px-6">
      <button
        type="button"
        aria-label="Fechar"
        onClick={handleClose}
        className="absolute top-6 left-6 cursor-pointer hover:text-secondary"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="grid w-full max-w-[1200px] grid-cols-3 items-stretch gap-6 lg:gap-8">
        <Planos tipo="basico" className="md:w-full min-h-0" />
        <Planos tipo="pro" className="md:w-full min-h-0" />
        <Planos tipo="institucional" className="md:w-full min-h-0" />
      </div>
    </div>
  );
}
