'use client'
import Image from "next/image";
import Button from '@/components/Button'
import ImgRabisco from '@/public/ImgRabisco.svg'
import ImgHome from '@/public/ImgHome.svg'
import desenho1 from '@/public/desenho.svg'
import desenho2 from '@/public/desenho2.svg'
import desenho3 from '@/public/desenho3.svg'
import { ChevronDown, ChevronRight, ChevronLeft } from "lucide-react"
import * as React from "react"

  type Testimonial = {
  name: string;
  role: string;
  text: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Rafaela Silva",
    role: "Professora da Escola E. Vila Feliz",
    text: "A MetamorphIA facilitou muito a minha vida!",
  },
  {
    name: "Getúlio Alves",
    role: "Professor da Escola Estudar",
    text: "Não estava acreditando, mas definitivamente superou minhas expectativas.",
  },
  {
    name: "Mariana Costa",
    role: "Professora da Escola Novo Saber",
    text: "Economizo horas de planejamento toda semana.",
  },
  {
    name: "João Pereira",
    role: "Professor da Escola Aprender+",
    text: "Meus alunos com TEA se adaptaram muito melhor às atividades.",
  },
];

const ITEMS_PER_PAGE = 2;

export default function Home() {
  const [isOpenf1, setIsOpenf1] = React.useState(false) 
  const [isOpenf2, setIsOpenf2] = React.useState(false) 
  const [isOpenf3, setIsOpenf3] = React.useState(false) 

const [page, setPage] = React.useState(0);
  const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE);

  const goPrev = () => setPage((p) => (p === 0 ? totalPages - 1 : p - 1));
  const goNext = () => setPage((p) => (p === totalPages - 1 ? 0 : p + 1));

  const visible = testimonials.slice(
    page * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE + ITEMS_PER_PAGE
  );


  return (
    <main className="flex flex-1 mt-10 font-(family-name:--font-poppins)">
      <div className="flex flex-col w-full px-20 gap-50">
        <div className="flex w-full justify-between items-center mt-14 px-5">
          <div className="max-w-xl flex flex-col gap-10">
            <h1 className="text-4xl text-center leading-normal self-center text-[#433F3F]">
              Cada criança aprende
              <br />
              <span className="relative inline-block">
                <b className="relative z-10">do seu jeito.</b>
                <Image
                  src={ImgRabisco}
                  alt=""
                  aria-hidden="true"
                  className="absolute -bottom-28 left-1/2 -translate-x-1/2 w-[135%] max-w-none pointer-events-none select-none z-0"
                />
              </span>
              <br />
              <span className="relative z-10">A gente adapta!</span>
            </h1>

            <p className="text-[#797979] text-sm text-center">
              Nossa IA transforma qualquer atividade pedagógica em uma versão feita sob medida para crianças neurodivergentes — em segundos, sem precisar de formação especializada.
            </p>

            <div className="flex gap-20 px-8">
              <Button className="py-1 font-(family-name:--font-text-me-one) text-xl w-auto">Adaptar uma atividade</Button>
              <Button className="py-1  bg-[#FFFDFA] border border-[#D4C7F8] hover:bg-[#D4C7F8] font-(family-name:--font-text-me-one) text-xl w-auto">
                Como funciona?
              </Button>
            </div>
          </div>

          <div><img src={ImgHome.src} alt="" width={500}/></div>
        </div>
        <div className="flex flex-col items-start">
          <div className="relative inline-block">
          <Image
                  src={ImgRabisco}
                  alt=""
                  aria-hidden="true"
                  className="absolute -bottom-13.5 left-1/2 -translate-x-1/2 w-[130%] max-w-none pointer-events-none select-none z-0"
                />
            <p className="relative text-2xl z-10">Como Funciona</p>
          </div>
          <div className="flex w-full justify-between mt-2 items-center">
            <img src={desenho1.src}/>
            <div className="flex flex-col self-center gap-10">
              <div className="flex gap-8 items-center">
                <div className=" flex items-center justify-center w-10 h-10 bg-[#FF9999]/50 rounded-full font-(family-name:--font-text-me-one) text-3xl select-none">1</div>
              <h1 className="text-3xl font-(family-name:--font-text-me-one)">
                Crie sua conta
              </h1>
              </div>
              <p className="text-sm max-w-160 ml-2 text-[#797979] text-justify">O cadastro é rápido e gratuito. Com ele, você terá um espaço só seu para organizar suas turmas e acompanhar o progresso de cada aluno com autonomia.</p>
            </div>
          
          </div>
                    <div className="flex w-full justify-between items-center">
            
            <div className="flex flex-col self-center gap-10">
              <div className="flex gap-8 items-center">
                <div className=" flex items-center justify-center w-10 h-10 bg-[#FFD279]/50 rounded-full font-(family-name:--font-text-me-one) text-3xl select-none ">2</div>
              <h1 className="text-3xl font-(family-name:--font-text-me-one)">
                Crie suas turmas e adicione seus alunos
              </h1>
              </div>
              <p className="text-sm max-w-160 ml-2 text-[#797979] text-justify">Organize suas turmas da forma que preferir e cadastre cada aluno individualmente. No perfil de cada um, você pode registrar informações importantes como a neurodiivergência presente, características e necessidades específicas — tudo em um único lugar, acessível sempre que precisar.</p>
            </div>
          <img src={desenho2.src}/>
          </div>
                    <div className="flex w-full justify-between items-center">
            <img src={desenho3.src}/>
            <div className="flex flex-col self-center gap-10">
              <div className="flex gap-8 items-center">
                <div className=" flex items-center justify-center w-10 h-10 bg-[#CEFFCA]/50 rounded-full font-(family-name:--font-text-me-one) text-3xl">3</div>
              <h1 className="text-3xl font-(family-name:--font-text-me-one)">
                Crie e adapte atividades
              </h1>
              </div>
              <p className="text-sm max-w-160 ml-2 text-[#797979] text-justify">Com o perfil do aluno em mãos, nosso Agente de Inteligência Artificial sugere e adapta atividades pedagógicas de acordo com as especificidades de cada neurodiivergência. Chega de retrabalho: você recebe orientações práticas, prontas para aplicar em sala de aula.</p>
            </div>
          
          </div>
          <Button className="w-auto mt-3 py-1 self-center text-xl font-(family-name:--font-text-me-one)">Adaptar uma Atividade</Button>
        </div>
        <div className="flex flex-col mt-50 text-2xl gap-6">
          <h1>FAQ</h1>
          <div className="flex flex-col gap-2">
            <div className="flex w-full py-0.5 bg-[#797979] rounded-[70px] px-10 cursor-pointer select-none justify-between items-center" onClick={() => setIsOpenf1(!isOpenf1)}>
              <p className="font-(family-name:--font-text-me-one) text-[#FFFDFA]">Quem pode usar a plataforma?</p>
              <ChevronDown
                        className={`w-9 h-9 transition-transform duration-200 text-[#FFFDFA] ${
                          isOpenf1 ? "rotate-180" : "rotate-0"
                        }`}
                      />
            </div>
            <div className={`grid transition-all overflow-hidden duration-200 ease-in-out bg-[#D9D9D9] rounded-t-[25px] rounded-b-[70px] ${isOpenf1 ? 'grid-rows-[1fr] opacity-100 px-3 py-4' : 'grid-rows-[0fr] opacity-0 py-0'}`}>
              <p className="text-sm text-[#797979] overflow-hidden text-justify">
                Sim! Totalmente gratuito. É só criar sua conta e já começar a adaptar atividades, configurar o perfil da criança e explorar todos os formatos.
              </p>
            </div>
                        <div className="flex w-full py-0.5 bg-[#797979] rounded-[70px] px-10 cursor-pointer select-none justify-between items-center" onClick={() => setIsOpenf2(!isOpenf2)}>
              <p className="font-(family-name:--font-text-me-one) text-[#FFFDFA]">Funciona para qualquer diagnóstico?</p>
              <ChevronDown
                        className={`w-9 h-9 transition-transform duration-200 text-[#FFFDFA] ${
                          isOpenf2 ? "rotate-180" : "rotate-0"
                        }`}
                      />
            </div>
            <div className={`grid transition-all overflow-hidden duration-200 ease-in-out bg-[#D9D9D9] rounded-t-[25px] rounded-b-[70px] ${isOpenf2 ? 'grid-rows-[1fr] opacity-100 px-3 py-4' : 'grid-rows-[0fr] opacity-0 py-0'}`}>
              <p className="text-sm text-[#797979] overflow-hidden text-justify">
                Sim! Totalmente gratuito. É só criar sua conta e já começar a adaptar atividades, configurar o perfil da criança e explorar todos os formatos.
              </p>
            </div>
            <div className="flex w-full py-0.5 bg-[#797979] rounded-[70px] px-10 cursor-pointer select-none justify-between items-center" onClick={() => setIsOpenf3(!isOpenf3)}>
              <p className="font-(family-name:--font-text-me-one) text-[#FFFDFA]">O uso é gratuito?</p>
              <ChevronDown
                        className={`w-9 h-9 transition-transform duration-200 text-[#FFFDFA] ${
                          isOpenf3 ? "rotate-180" : "rotate-0"
                        }`}
                      />
            </div>
            <div className={`grid transition-all overflow-hidden duration-200 ease-in-out bg-[#D9D9D9] rounded-t-[25px] rounded-b-[70px] ${isOpenf3 ? 'grid-rows-[1fr] opacity-100 px-3 py-4' : 'grid-rows-[0fr] opacity-0 py-0'}`}>
              <p className="text-sm text-[#797979] text-justify">
                Sim! Totalmente gratuito. É só criar sua conta e já começar a adaptar atividades, configurar o perfil da criança e explorar todos os formatos.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start gap-10 -mt-20">
  <div className="relative inline-block">
    <Image
      src={ImgRabisco}
      alt=""
      aria-hidden="true"
      className="absolute -bottom-11.5 left-1/2 -translate-x-1/2 w-[130%] max-w-none pointer-events-none select-none z-0"
    />
    <p className="relative text-2xl z-10">Eles aprovam</p>
  </div>

  <div className="relative w-full">
    <button
      onClick={goPrev}
      aria-label="Anterior"
      className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-[#FFFDFA]/50 hover:bg-[#D9D9D9]/50 transition-colors"
    >
      <ChevronLeft className="w-10 h-10 text-[#433F3F]" />
    </button>

    <div className="flex gap-6 w-full">
      {visible.map((t, i) => (
        <div
          key={`${page}-${i}`}
          className="flex-1 bg-[#D9D9D9] rounded-[70px] px-8 py-6 min-w-0"
        >
          <p className="text-xs text-[#5c5c5c] truncate">
            {t.name} – {t.role}
          </p>
          <p className="text-sm text-[#433F3F] truncate">{t.text}</p>
        </div>
      ))}
    </div>

    <button
      onClick={goNext}
      aria-label="Próximo"
      className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 flex items-center justify-center w-12 h-12 rounded-full bg-[#FFFDFA]/50 hover:bg-[#D9D9D9]/50 transition-colors"
    >
      <ChevronRight className="w-10 h-10 text-[#433F3F]" />
    </button>
  </div>
  <div className="flex self-center mt-10 w-12 h-12 rounded-full bg-[#433F3F] items-center justify-center cursor-pointer" onClick={() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }}>
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.8906 25.8684C11.8906 26.9003 12.7271 27.7368 13.759 27.7368C14.7909 27.7368 15.6275 26.9003 15.6275 25.8684L13.759 25.8684L11.8906 25.8684ZM15.0802 0.547235C14.3505 -0.182428 13.1675 -0.182428 12.4379 0.547236L0.5473 12.4378C-0.182363 13.1675 -0.182363 14.3505 0.547301 15.0801C1.27696 15.8098 2.45998 15.8098 3.18965 15.0801L13.759 4.51076L24.3284 15.0801C25.0581 15.8098 26.2411 15.8098 26.9708 15.0801C27.7004 14.3505 27.7004 13.1675 26.9708 12.4378L15.0802 0.547235ZM13.759 25.8684L15.6275 25.8684L15.6275 1.86841L13.759 1.86841L11.8906 1.86841L11.8906 25.8684L13.759 25.8684Z" fill="#FFFDFA"/>
</svg>
</div>
</div>
      </div>
    </main>
  );
}