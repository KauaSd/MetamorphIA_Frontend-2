import { Suspense } from "react";
import ConteudoDashboardTurma from "@/components/app/ConteudoDashboardTurma";
import CarregandoDashboard from "@/components/app/CarregandoDashboard";

// useSearchParams roda so no cliente, entao o conteudo precisa de um boundary
// de Suspense para a pagina continuar sendo prerenderizada
export default function DashboardTurma() {
  return (
    <Suspense fallback={<CarregandoDashboard />}>
      <ConteudoDashboardTurma />
    </Suspense>
  );
}
