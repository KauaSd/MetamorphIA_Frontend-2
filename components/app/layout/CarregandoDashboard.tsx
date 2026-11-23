import { BarraCarregando } from "@/components/common/Carregando";

interface CarregandoDashboardProps {
  mensagem?: string;
}

export default function CarregandoDashboard({
  mensagem = "Carregando",
}: CarregandoDashboardProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={mensagem}
      className="flex min-h-[60vh] w-full flex-1 items-center justify-center px-4"
    >
      <BarraCarregando className="w-52 sm:w-60" />
    </div>
  );
}
