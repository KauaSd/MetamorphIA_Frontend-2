import { Suspense } from "react";
import ConteudoChat from "@/components/app/ConteudoChat";

// useSearchParams roda so no cliente, entao o conteudo precisa de um boundary
// de Suspense para a pagina continuar sendo prerenderizada
export default function Chat() {
  return (
    <Suspense fallback={null}>
      <ConteudoChat />
    </Suspense>
  );
}
