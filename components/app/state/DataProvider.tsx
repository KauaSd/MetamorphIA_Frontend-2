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

const DataContext = createContext<DataContextValue | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [estado, setEstado] = useState<AppData>({ ...dadosVazios });
  const [hydrated, setHydrated] = useState(false);

  const recarregar = useCallback(async () => {
    try {
      const dados = await repository.carregarDados();
      setEstado(dados);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    recarregar();
  }, [recarregar]);

  const value = useMemo<DataContextValue>(
    () => ({
      ...estado,
      hydrated,
      recarregar,
    }),
    [estado, hydrated, recarregar]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (ctx === undefined) {
    throw new Error("useData must be used within DataProvider");
  }
  return ctx;
}
