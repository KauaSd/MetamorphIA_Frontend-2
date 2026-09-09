import Logo from "@/public/icon.png";
import { Poppins, Text_Me_One } from "next/font/google";
import Button from "@/components/Button";

const TextMeOne = Text_Me_One({
  variable: "--font-text-me-one",
  weight: "400",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: "400",
  subsets: ["latin"],
});

export default function NotFound() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-linear-to-b from-[#F0F0F0] to-[#FF9999]/50">
     
      <div className="absolute inset-0 z-0 h-full w-full pointer-events-none select-none">

        <img
          src="/VetorFita07.svg"
          alt=""
          className="absolute top-1/3 -left-[10%] w-[120%] max-w-none pointer-events-none select-none sm:left-0 sm:w-full"
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="w-full px-4 py-4 sm:px-8 sm:py-8">
          <header className="mx-auto flex min-h-11 w-full lg:max-w-[110rem] items-center justify-center gap-2 rounded-[70px] bg-[#433F3F] px-4 py-1.5 text-[#FFFDFA] sm:min-h-14 sm:py-2">
            <img src={Logo.src} alt="" className="w-7 sm:w-11" />
            <p className={`${TextMeOne.variable} text-xl sm:text-[2rem] font-(family-name:--font-text-me-one)`}>
              MetamorphIA
            </p>
          </header>
        </div>

        <main className={`flex flex-1 items-center justify-center px-4 ${poppins.variable} font-(family-name:--font-poppins)`}>
          <div className="flex w-full max-w-3xl flex-col items-center gap-5 rounded-[40px] bg-[#FFFDFA] p-8 sm:flex-row sm:gap-6 sm:rounded-[70px] sm:p-10">
            <div className="flex flex-col items-center gap-2">
              <p className="text-[#FF9999] text-6xl sm:text-7xl">404</p>
              <h1 className="text-sm text-[#797979]">Ops, não encontramos</h1>
              <Button className="bg-[#FF9999] hover:bg-[#FF9999]/80mt-1">
                Voltar
              </Button>
            </div>

            <div className="hidden h-32 w-32 shrink-0 sm:block">

            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 