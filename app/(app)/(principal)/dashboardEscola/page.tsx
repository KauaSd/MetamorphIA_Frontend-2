import { Suspense } from "react";
import ConteudoDashboardEscola from "@/components/app/escolas/ConteudoDashboardEscola";
import CarregandoDashboard from "@/components/app/layout/CarregandoDashboard";

export default function DashboardEscola() {
  return (
    <Suspense fallback={<CarregandoDashboard />}>
      <ConteudoDashboardEscola />
    </Suspense>
  );
}
