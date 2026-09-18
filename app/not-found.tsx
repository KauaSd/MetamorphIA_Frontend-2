import Logo from "@/public/icon.png";
import { Poppins, Text_Me_One } from "next/font/google";
import Button from "@/components/common/Button";
import desenho1 from "@/public/desenho.svg";

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
          src="/VetorFitaErro.svg"
          alt=""
          className="absolute top-1/3 -left-[10%] w-[120%] max-w-none pointer-events-none select-none sm:left-0 sm:w-full"
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="w-full px-4 py-4 sm:px-8 sm:py-8">
          <header className="mx-auto flex min-h-11 w-full lg:max-w-[110rem] items-center justify-center gap-2 rounded-[70px] bg-[#433F3F] px-4 py-1.5 text-[#FFFDFA] sm:min-h-14 sm:py-2">
            <img src={Logo.src} alt="" className="w-7 sm:w-11" />
            <p
              className={`${TextMeOne.variable} text-xl sm:text-[2rem] font-(family-name:--font-text-me-one)`}
            >
              MetamorphIA
            </p>
          </header>
        </div>

        <main
          className={`flex flex-1 items-center justify-center px-4 ${poppins.variable} font-(family-name:--font-poppins)`}
        >
          <div className="flex h-auto w-full max-w-[985px] flex-col items-center justify-between gap-10 rounded-[40px] bg-[#FFFDFA] p-8 sm:h-[598px] sm:flex-row sm:gap-8 sm:rounded-[70px] sm:p-14">
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              <p className="text-[#FF9999] text-[100px] sm:text-[150px]">404</p>
              <h1 className="text-[20px] sm:text-[25px] text-[#797979]">
                Ops, não encontramos
              </h1>
              <Button className="bg-[#FF9999] hover:bg-[#FF9999]/80 mt-1 p-1 text-[14px] text-[#433F3F]">
                Voltar
              </Button>
            </div>

            <div className="flex w-full max-w-[380px] items-center justify-center sm:w-auto">
              <img src={desenho1.src} className="h-auto w-full max-w-[380px]" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
