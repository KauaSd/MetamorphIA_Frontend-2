"use client";

import Menu from "@/components/app/Menu";
import { FormIdentificacao } from "@/components/app/forms/FormAlunoTurma";
import { useData } from "@/components/app/state/DataProvider";

export default function PrincipalLayout({ children }: { children: React.ReactNode }) {
  const { hydrated, teacherName, recarregar } = useData();

  // hydrated evita o modal piscar: so se exige identificacao depois que sabemos que nao ha nome
  const precisaIdentificar = hydrated && teacherName === null;

  return (
    <div className="flex min-h-screen w-full flex-row">
      <Menu />
      <main className="flex flex-1 min-w-0 flex-col">{children}</main>
      {precisaIdentificar && <FormIdentificacao onSalvar={recarregar} />}
    </div>
  );
}
