import Logo from "@/public/icon.png";

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
        <div className="w-full px-5 sm:px-10 md:px-16 lg:px-23 pt-5 sm:pt-7 md:pt-10">
          <header className="mx-auto flex min-h-11 w-full lg:max-w-[110rem] items-center justify-center gap-2 rounded-[70px] bg-[#433F3F] px-5 sm:px-8 md:px-12 lg:px-15 text-[#FFFDFA] sm:min-h-14">
            <img src={Logo.src} alt="" className="w-7 sm:w-11" />
            <p className="text-xl sm:text-[2rem] font-(family-name:--font-text-me-one)">
                MetamorphIA
            </p>
            </header>
        </div>

        <main className="flex flex-1 flex-col font-(family-name:--font-poppins) overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}