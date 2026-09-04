import Logo from "@/public/icon.png";
import { Poppins, Text_Me_One } from "next/font/google";

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

export default function Auth({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F0F0F0]">
      <div className="absolute inset-0 z-0 h-full w-full pointer-events-none select-none">
        <img
          src="/Elipse1.svg"
          alt=""
          className="absolute top-0 left-0 w-[22rem] max-w-none pointer-events-none select-none sm:w-[32rem] lg:w-auto"
        />
        <img
          src="/Elipse2.svg"
          alt=""
          className="absolute right-0 bottom-0 w-[24rem] max-w-none pointer-events-none select-none sm:w-[34rem] lg:w-auto"
        />
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

        <main className={`flex-1 ${poppins.variable} font-(family-name:--font-poppins) overflow-hidden`}>
          {children}
        </main>
      </div>
    </div>
  );
}