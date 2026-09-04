import Apple from "@/public/iconeApple.svg";
import Google from "@/public/iconeGoogle.svg";

export default function LogIn() {
  return (
    <div className="mx-auto mt-6 w-full max-w-md px-4 sm:mt-7 sm:px-0">
      <div className="flex items-center justify-center gap-3 sm:gap-6">
        <div className="h-px flex-1 bg-[#797979]" />
        <p className="text-sm text-[#797979]">ou</p>
        <div className="h-px flex-1 bg-[#797979]" />
      </div>

      <div className="mt-2 flex flex-row justify-center gap-2">
        <img src={Google.src} className="cursor-pointer" alt="Entrar com Google" />
        <img src={Apple.src} className="cursor-pointer" alt="Entrar com Apple" />
      </div>
    </div>
  );
}