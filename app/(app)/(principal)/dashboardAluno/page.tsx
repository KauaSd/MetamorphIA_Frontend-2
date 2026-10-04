import { Suspense } from "react";
import ConteudoDashboardAluno from "@/components/app/ConteudoDashboardAluno";
import CarregandoDashboard from "@/components/app/CarregandoDashboard";

// useSearchParams roda so no cliente, entao o conteudo precisa de um boundary
// de Suspense para a pagina continuar sendo prerenderizada
export default function DashboardAluno() {
  return (
    <Suspense fallback={<CarregandoDashboard />}>
      <ConteudoDashboardAluno />
    </Suspense>
  );
}
