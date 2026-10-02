import LogIn from "@/components/app/LogIn";
import { FormLogin } from "@/components/app/forms/FormAuth";

export default function Login() {
  return (
    // container que centraliza o formulario na tela
    <div className="flex min-h-full flex-1 flex-col justify-center py-6">
      {/* area do formulario */}
      <div className="relative flex w-full items-stretch justify-center overflow-hidden px-4 sm:px-6">
        <FormLogin />
      </div>

      {/* botao flutuante de login */}
      <LogIn />
    </div>
  );
}