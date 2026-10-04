"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { repository } from "@/utils/data/dataRepository";
import { dadosVazios, type AppData } from "@/utils/data/types";

export interface DataContextValue extends AppData {
  hydrated: boolean;
  recarregar: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [dados, setDados] = useState<AppData>(dadosVazios);
  const [hydrated, setHydrated] = useState(false);

  const recarregar = useCallback(async () => {
    const [turmas, alunos, conversas, teacherName] = await Promise.all([
      repository.listTurmas(),
      repository.listAlunos(),
      repository.listConversas(),
      repository.getTeacherName(),
    ]);

    setDados({ turmas, alunos, conversas, teacherName });
  }, []);

  // a leitura acontece depois da hidratacao: no primeiro render o estado e o de servidor,
  // que e vazio. Sem isso o modal de Identificacao piscaria para quem ja se identificou.
  useEffect(() => {
    let cancelado = false;

    async function hidratar() {
      await recarregar();
      if (cancelado) return;
      setHydrated(true);
    }

    hidratar();

    return () => {
      cancelado = true;
    };
  }, [recarregar]);

  const valor = useMemo<DataContextValue>(
    () => ({ ...dados, hydrated, recarregar }),
    [dados, hydrated, recarregar],
  );

  return <DataContext.Provider value={valor}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const contexto = useContext(DataContext);

  if (!contexto) {
    throw new Error("useData precisa estar dentro de <DataProvider>");
  }

  return contexto;
}
