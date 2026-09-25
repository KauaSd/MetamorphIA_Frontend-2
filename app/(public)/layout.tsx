import Logo from "@/public/icon.png";
import ButtonLink from "@/components/common/ButtonLink";
import elipse1 from "@/public/ElipseHome1.svg";
import fitacolorida from "@/public/FitaColoridahome.svg";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative isolate font-(family-name:--font-poppins) min-h-full flex flex-col overflow-x-hidden px-5 sm:px-10 md:px-16 lg:px-23 pt-5 sm:pt-7 md:pt-10 bg-[#FFFDFA]">
      <header className="flex w-full min-h-11 sm:min-h-14 bg-[#433F3F] rounded-[70px]">
        <div className="flex justify-between w-full px-5 sm:px-8 md:px-12 lg:px-15 items-center">
          <Link href="/">
            <div className="flex gap-2 items-center justify-center min-w-0 cursor-pointer">
              <img
                src={Logo.src}
                alt=""
                className="w-7 sm:w-9 lg:w-11 select-none shrink-0"
              />

              <p className="text-xl sm:text-2xl lg:text-[2rem] font-(family-name:--font-text-me-one) text-[#FFFDFA] select-none truncate">
                MetamorphIA
              </p>
            </div>
          </Link>
          <div className="flex items-center justify-center gap-2 sm:gap-3 shrink-0">
            <ButtonLink
              href="../auth/cadastro"
              className="font-(family-name:--font-text-me-one) py-1! bg-[#FFFDFA] hover:bg-[#CAC7C2] text-base! sm:text-lg lg:text-xl w-auto"
            >
              Cadastro
            </ButtonLink>

            <ButtonLink
              href="../auth/login"
              className="font-(family-name:--font-text-me-one) py-1! text-base! sm:text-lg lg:text-xl w-auto"
            >
              Login
            </ButtonLink>
          </div>
        </div>
      </header>

      <img
        src={elipse1.src}
        alt=""
        aria-hidden="true"
        className="absolute left-0 top-0 -z-10 pointer-events-none select-none max-w-[45vw]"
      />

      <img
        src={elipse1.src}
        alt=""
        aria-hidden="true"
        className="absolute right-0 rotate-180 top-110 -z-10 pointer-events-none select-none max-w-[45vw]"
      />

      <img
        src={fitacolorida.src}
        alt=""
        className="absolute -z-10 left-0 scale-110 origin-top top-125 w-[20000px] pointer-events-none select-none"
        aria-hidden="true"
      />

      {children}

      <footer className="relative left-1/2 right-1/2 mt-15 -mx-[50vw] w-screen min-h-60 bg-[#433F3F] px-8 sm:px-12 md:px-24 lg:px-50 py-8 flex flex-col md:flex-row items-start justify-between gap-10 md:gap-8">
        <div className="flex flex-col max-w-full md:max-w-[50%]">
          <div className="flex items-center justify-center w-auto h-auto gap-2 self-start">
            <img
              src={Logo.src}
              alt=""
              className="w-7 sm:w-9 lg:w-11 select-none"
            />

            <p className="text-xl sm:text-2xl lg:text-[2rem] font-(family-name:--font-text-me-one) text-[#FFFDFA] select-none">
              MetamorphIA
            </p>
          </div>

          <p className="w-full text-[#797979] text-sm text-justify mt-2 font-(family-name:--font-poppins)">
            Nossa IA transforma qualquer atividade pedagógica em uma versão
            feita sob medida para crianças neurodivergentes — em segundos, sem
            precisar de formação especializada.
          </p>

          <div className="flex flex-col mt-8 lg:mt-10">
            <p className="text-[#797979] text-sm text-justify mt-2">Duvidas?</p>

            <p className="text-[#797979] text-sm text-justify break-words">
              Fale conosco :{" "}
              <span className="underline">metamorphIA@gmail.com</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[#FFFDFA] text-2xl font-(family-name:--font-text-me-one)" >
            Página
          </p>

          <div>
            <Link href="#ComoFunciona">
            <p className="text-[#797979] text-sm underline cursor-pointer">
              Como funciona?
            </p>
            </Link>

            <Link href="#FAQ">
            <p className="text-[#797979] text-sm underline cursor-pointer">
              FAQ
            </p>
            </Link>
          </div>
        </div>

        <div>
          <p className="text-[#FFFDFA] text-2xl font-(family-name:--font-text-me-one)">
            Termos
          </p>

          <div>
            <Link href="/privacidade">
              <p className="text-[#797979] text-sm underline cursor-pointer">
                Política de Privacidade
              </p>
            </Link>
            <Link href="/uso">
              <p className="text-[#797979] text-sm underline cursor-pointer">
                Termos de Serviço
              </p>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
