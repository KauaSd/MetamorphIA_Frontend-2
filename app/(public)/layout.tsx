
import Logo from '@/public/icon.png'
import Button from '@/components/Button'
import elipse1 from '@/public/ElipseHome1.svg'
import fitacolorida from '@/public/FitaColoridahome.svg'
import Link from "next/link"

export default function RootLayout({ children }: {children: React.ReactNode}) {
  return (
      <div className="font-(family-name:--font-poppins) min-h-full flex flex-col overflow-x-hidden px-23 pt-10 bg-[#FFFDFA]">
      <header className="flex w-full h-14 bg-[#433F3F] rounded-[70px]">
      <div className="flex justify-between w-full px-15">
        <div className="flex gap-2 items-center justify-center">
        <img src={Logo.src} alt="" className="w-7 sm:w-11 select-none" />
            <p className={`text-xl sm:text-[2rem] font-(family-name:--font-text-me-one) text-[#FFFDFA] select-none`}>
                MetamorphIA
            </p>
        </div>
        <div className="flex items-center justify-center gap-3">
        <Link href="auth/cadastro">
        <Button className="font-(family-name:--font-text-me-one) py-1 bg-[#FFFDFA] hover:bg-[#CAC7C2] text-xl w-auto">Cadastro</Button>
        </Link>
        <Link href="auth/login">
        <Button className="font-(family-name:--font-text-me-one) py-1 text-xl w-auto">Login</Button>
        </Link>
        </div>
      </div>
    </header>
<img
  src={elipse1.src}
  alt=""
  aria-hidden="true"
  className="absolute left-0 top-0 -z-10 pointer-events-none select-none"
/>
<img
  src={elipse1.src}
  alt=""
  aria-hidden="true"
  className="absolute right-0 rotate-180 top-110 -z-10 pointer-events-none select-none"
/>
<img src={fitacolorida.src} alt="" className="absolute -z-10 left-0  scale-110 origin-top top-125 w-[20000px]" aria-hidden="true"></img>
        {children}
        <img src={fitacolorida.src} alt="" className="absolute -z-10 left-0  scale-110 origin-top top-630 w-[20000px] rotate-180" aria-hidden="true"></img>     
  <footer className="relative left-1/2 right-1/2 -mx-[50vw] w-screen h-60 mt-20 bg-[#433F3F] px-50 py-8 flex items-start justify-between"> 
  <div className="flex flex-col">
        <div className="flex items-center justify-center w-auto h-auto gap-2 self-start">
  <img src={Logo.src} alt="" className="w-7 sm:w-11 select-none" />
  <p className="text-xl sm:text-[2rem] font-(family-name:--font-text-me-one) text-[#FFFDFA] select-none">
    MetamorphIA
  </p>
</div>
<p className="w-200 text-[#797979] text-sm text-justify mt-2 font-(family-name:--font-poppins)">Nossa IA transforma qualquer atividade pedagógica em uma versão feita sob medida para crianças neurodivergentes — em segundos, sem precisar de formação especializada.</p>
<div className="flex flex-col mt-10">
<p className="text-[#797979] text-sm text-justify mt-2 font-(family-name:--font-poppins)">Duvidas?</p>
<p className="text-[#797979] text-sm text-justify font-(family-name:--font-poppins)">Fale conosco :  <span className="underline">metamorphIA@gmail.com</span></p>
</div>
<div>
  
</div>
</div>
<div className="flex flex-col gap-2">
  <p className="text-[#FFFDFA] text-2xl font-(family-name:--font-text-me-one)">Página</p>
  <div>
    <p className="text-[#797979] text-sm font-(family-name:--font-poppins) underline cursor-pointer" >Como funciona?</p>
    <p className="text-[#797979] text-sm font-(family-name:--font-poppins) underline cursor-pointer">FAQ</p>
  </div>
  </div>
  <div>
    <p className="text-[#FFFDFA] text-2xl font-(family-name:--font-text-me-one)">Termos</p>
      <div>
    <p className="text-[#797979] text-sm font-(family-name:--font-poppins) underline cursor-pointer">Política de Privacidade</p>
    <p className="text-[#797979] text-sm font-(family-name:--font-poppins) underline cursor-pointer">Termos de serviço</p>
  </div>
  </div>
          </footer>
        </div>

  );
}
