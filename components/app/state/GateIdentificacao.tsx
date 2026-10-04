"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/components/app/state/DataProvider";
import { saveTeacherName } from "@/utils/data/controller";
import { ALERTAS } from "@/utils/alertas";
import Toast, { useAlerta } from "@/components/common/Toast";
import { FormIdentificacao } from "@/components/app/forms/FormAlunoTurma";

export default function GateIdentificacao({ onSalvar }: { onSalvar: () => Promise<void> }) {
  const router = useRouter();
  const { teacherName, recarregar } = useData();
  const { alerta, mostrar, limpar } = useAlerta();

  if (teacherName !== null) {
    return null;
  }

  const handleSalvar = async () => {
    await recarregar();
    await onSalvar();
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-base px-4">
      <FormIdentificacao onSalvar={handleSalvar} />
      {alerta && <Toast alerta={alerta} limpar={limpar} />}
    </div>
  );
}