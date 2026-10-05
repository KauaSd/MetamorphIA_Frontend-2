"use client";

import { useState } from "react";
import Menu from "@/components/app/Menu";
import Tutorial, { type tutId } from "@/components/app/Tutorial";
import { FormIdentificacao } from "@/components/app/forms/FormAlunoTurma";
import { useData } from "@/components/app/state/DataProvider";

export default function PrincipalLayout({ children }: { children: React.ReactNode }) {
  const { hydrated, teacherName, recarregar } = useData();
  const [passoTutorial, setPassoTutorial] = useState<tutId | null>(null);

  // hydrated evita o modal piscar: so se exige identificacao depois que sabemos que nao ha nome
  const precisaIdentificar = hydrated && teacherName === null;

  // quemacabou de se identificar ve o tutorial do primeiro passo
  const handleSalvar = async () => {
    await recarregar();
    setPassoTutorial("1");
  };

  return (
    <div className="flex min-h-screen w-full flex-row">
      <Menu />
      <main className="flex flex-1 min-w-0 flex-col">{children}</main>
      {precisaIdentificar && <FormIdentificacao onSalvar={handleSalvar} />}
      {passoTutorial && (
        <Tutorial tipo={passoTutorial} onClose={() => setPassoTutorial(null)} />
      )}
    </div>
  );
}
