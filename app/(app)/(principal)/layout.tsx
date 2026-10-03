"use client";

import { ReactNode, Suspense, useState } from "react";
import { useData } from "@/components/app/state/DataProvider";
import { FormIdentificacao } from "@/components/app/forms/FormAlunoTurma";
import { saveTeacherName } from "@/utils/data/controller";

export default function PrincipalLayout({ children }: { children: ReactNode }) {
  const { hydrated, teacherName, recarregar } = useData();

  if (hydrated && teacherName === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-page px-4">
        <Suspense fallback={null}>
          <FormIdentificacao
            onSalvar={async () => {
              await recarregar();
            }}
          />
        </Suspense>
      </div>
    );
  }

  return <>{children}</>;
}
