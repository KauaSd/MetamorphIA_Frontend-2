"use client";

import Icon from "@/public/icon.png";
import { ChevronDown } from "lucide-react";
import React from "react";
import TagAluno from './TagAluno';
import Link from "next/link"
export default function Menu() {
  const [isOpen, setIsOpen] = React.useState(true);
  const [isAlunoOpen, setIsAlunoOpen] = React.useState(false);
  const [isTurmaOpen, setIsTurmaOpen] = React.useState(false); 
  const [isRecentesOpen,setIsRecentesOpen] = React.useState(false);
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1280) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {/* Backdrop: só aparece no mobile quando o menu está aberto (overlay) da pra usar isso direto com o coiso que a Angel vai fazer */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

<div
  className={`z-50 h-[100dvh] shrink-0 bg-[#433F3F] flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${
    isOpen
      ? "fixed inset-y-0 left-0 w-[min(18rem,85vw)] md:sticky md:top-0 md:self-start md:z-auto md:w-72"
      : "sticky top-0 self-start w-16 cursor-pointer md:w-20 z-auto"
  }`}
  onClick={() => {
    if (!isOpen) {
      setIsOpen(true);
    }
  }}
>

        <div className="flex h-full w-full min-w-0 flex-col justify-between overflow-y-auto overflow-x-hidden p-4 md:p-5">
        <div className="c1 min-w-0">
          <div
            className={`flex flex-row items-center ${
              isOpen ? "justify-between" : "justify-center"
            }`}
          >      
            <div className="flex gap-1 items-center">
              <img
                src={Icon.src}
                alt=""
                className="h-8 w-8 pointer-events-none select-none md:h-10 md:w-10"
              />

              <h1
                className={`text-2xl text-[#FFFDFA] font-(family-name:--font-text-me-one) select-none md:text-3xl ${
                  !isOpen && "hidden"
                }`}
              >
                MetamorphIA
              </h1>
            </div>

            <div
              className={`cursor-pointer p-2 -m-2 ${!isOpen && "hidden"}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                setIsAlunoOpen(false);
                setIsTurmaOpen(false);
                setIsRecentesOpen(false);
              }}
            >
              <svg
                className="w-10 h-7 md:w-9 md:h-6"
                viewBox="0 0 30 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="29"
                  height="19"
                  rx="4.5"
                  stroke="white"
                />
                <line x1="8.92676" x2="8.92676" y2="20" stroke="white" />
              </svg>
            </div>
          </div>

          <div className="border-t w-full border-[#FFFDFA] my-5" />

          <div className={`flex flex-col min-w-0 ${isOpen ? "gap-3" : "gap-0"}`}>
            {/* TURMAS */}
            <div className="flex flex-col w-full min-w-0">
              <div
                className={`h-[35px] flex items-center ${
                  isOpen
                    ? "w-full justify-between"
                    : "w-[30px] justify-center mx-auto"
                }`}
              >
                <Link href="./turmas">
                <div className="flex items-center gap-4 cursor-pointer">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_763_1155)">
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M20.8374 16.4125C22.5499 17.575 23.7499 19.15 23.7499 21.25V25H27.4999C28.1874 25 28.7499 24.4375 28.7499 23.75V21.25C28.7499 18.525 24.2874 16.9125 20.8374 16.4125Z"
                        fill="#FFFDFA"
                      />
                      <path
                        d="M11.25 15C14.0114 15 16.25 12.7614 16.25 10C16.25 7.23858 14.0114 5 11.25 5C8.48858 5 6.25 7.23858 6.25 10C6.25 12.7614 8.48858 15 11.25 15Z"
                        fill="#FFFDFA"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M18.7499 15C21.5124 15 23.7499 12.7625 23.7499 10C23.7499 7.2375 21.5124 5 18.7499 5C18.1624 5 17.6124 5.125 17.0874 5.3C18.1249 6.5875 18.7499 8.225 18.7499 10C18.7499 11.775 18.1249 13.4125 17.0874 14.7C17.6124 14.875 18.1624 15 18.7499 15Z"
                        fill="#FFFDFA"
                      />
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M11.25 16.25C7.9125 16.25 1.25 17.925 1.25 21.25V23.75C1.25 24.4375 1.8125 25 2.5 25H20C20.6875 25 21.25 24.4375 21.25 23.75V21.25C21.25 17.925 14.5875 16.25 11.25 16.25Z"
                        fill="#FFFDFA"
                      />
                    </g>

                    <defs>
                      <clipPath id="clip0_763_1155">
                        <rect width="30" height="30" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <p className={`text-white text-xl ${!isOpen && "hidden"} select-none`}>
                    Turmas
                  </p>
                </div>
                </Link>
                <ChevronDown
                  className={`w-7.5 h-7.5 text-[#FFFDFA] shrink-0 cursor-pointer transition-transform duration-200 ${
                    !isOpen && "hidden"
                  }
                  ${
                    isTurmaOpen ? "rotate-180" : "rotate-0"
                  }
                  `}
                  onClick={() => {setIsTurmaOpen(!isTurmaOpen)}}
                />
              </div>
                <div className={`grid w-full min-w-0 transition-all duration-200 ease-in-out ${isTurmaOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
  <div className="overflow-hidden w-full min-w-0">
    <div className="flex flex-col gap-2 mt-3 ml-5 min-w-0">
      <TagAluno label="TDAH" nome="1º Ano N - Período" ismenu={true}/>
    </div>
  </div>
</div>
              {!isOpen && <div className="border-t w-full border-[#FFFDFA] my-5" />}
            </div>


            {/* ALUNOS */}
            <div className="flex flex-col w-full min-w-0">
              <div
                className={`h-[35px] flex items-center ${
                  isOpen
                    ? "w-full justify-between"
                    : "w-[30px] justify-center mx-auto"
                }`}
              >
                <Link href="./alunos">
                <div className="flex items-center gap-4 cursor-pointer">
                  <svg
                    width="30"
                    height="30"
                    viewBox="0 0 30 30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_763_1156)">
                      <path
                        d="M15 15C17.7625 15 20 12.7625 20 10C20 7.2375 17.7625 5 15 5C12.2375 5 10 7.2375 10 10C10 12.7625 12.2375 15 15 15ZM15 17.5C11.6625 17.5 5 19.175 5 22.5V25H25V22.5C25 19.175 18.3375 17.5 15 17.5Z"
                        fill="#FFFDFA"
                      />
                    </g>

                    <defs>
                      <clipPath id="clip0_763_1156">
                        <rect width="30" height="30" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <p className={`text-white text-xl ${!isOpen && "hidden"} select-none`}>
                    Alunos
                  </p>
                </div>
                </Link>
                <ChevronDown
                  className={`w-7.5 h-7.5 text-[#FFFDFA] shrink-0 cursor-pointer transition-transform duration-200 ${
                    !isOpen && "hidden"
                  }
                  ${
                    isAlunoOpen ? "rotate-180" : "rotate-0"
                  }
                  `}
                  onClick={() => {setIsAlunoOpen(!isAlunoOpen)}}
                />
              </div>
<div className={`grid w-full min-w-0 transition-all duration-200 ease-in-out ${isAlunoOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
  <div className="overflow-hidden w-full min-w-0">
    <div className="flex flex-col gap-2 mt-3 ml-5 min-w-0">
      <TagAluno label="TDAH" nome="Aluno" ismenu={true}/>
    </div>
  </div>
</div>
              {!isOpen && <div className="h-px w-full bg-[#FFFDFA] mt-1" />}
            </div>
             {isOpen && <div className="h-px w-full bg-[#FFFDFA] mt-1 mb-1" />}
            {/* RECENTES */}

            <div className="flex flex-col w-full min-w-0 mt-3">
              <div
                className={`h-[35px] flex items-center ${
                  isOpen
                    ? "w-full justify-between"
                    : "w-[30px] justify-center mx-auto"
                }`}
              >
                <Link href="./recentes">
                <div className="flex items-center gap-4 cursor-pointer">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_1103_1127)">
                      <path
                        d="M4 6H2V20C2 21.1 2.9 22 4 22H18V20H4V6Z"
                        fill="#FFFDFA"
                      />
                      <path
                        d="M20 2H8C6.9 2 6 2.9 6 4V16C6 17.1 6.9 18 8 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 12L17.5 10.5L15 12V4H20V12Z"
                        fill="#FFFDFA"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_1103_1127">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <p className={`text-white text-xl ${!isOpen && "hidden"} select-none`}>
                    Recentes
                  </p>
                </div>
                </Link>
                <ChevronDown
                  className={`w-7.5 h-7.5 text-[#FFFDFA] shrink-0 transition-transform duration-200 cursor-pointer ${
                    !isOpen && "hidden"
                  }
                  ${
                    isRecentesOpen ? "rotate-180" : "rotate-0"
                  }
                  `}
                  onClick={() => setIsRecentesOpen(!isRecentesOpen)}
                />
              </div>
              <div className={`grid w-full min-w-0 transition-all duration-200 ease-in-out ${isRecentesOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
  <div className="overflow-hidden w-full min-w-0">
    <div className="flex flex-col gap-2 mt-3 ml-5 min-w-0">
      <TagAluno label="TDAH" nome="Aluno - Chat" ismenu={true}/>
    </div>
  </div>
</div>
            </div>
            </div>
          </div>
          <div className="config">
                      <div className="border-t w-full border-[#FFFDFA]" />
                        <div className="flex flex-col w-full mt-3">
              <div
                className={`h-[35px] flex items-center cursor-pointer ${
                  isOpen
                    ? "w-full justify-between"
                    : "w-[30px] justify-center mx-auto"
                }`}
              >
                <div className="flex items-center gap-4">
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M23.9251 16.175C23.9751 15.8 24.0001 15.4125 24.0001 15C24.0001 14.6 23.9751 14.2 23.9126 13.825L26.4501 11.85C26.6751 11.675 26.7376 11.3375 26.6001 11.0875L24.2001 6.9375C24.0501 6.6625 23.7376 6.575 23.4626 6.6625L20.4751 7.8625C19.8501 7.3875 19.1876 6.9875 18.4501 6.6875L18.0001 3.5125C17.9501 3.2125 17.7001 3 17.4001 3H12.6001C12.3001 3 12.0626 3.2125 12.0126 3.5125L11.5626 6.6875C10.8251 6.9875 10.1501 7.4 9.53764 7.8625L6.55014 6.6625C6.27514 6.5625 5.96264 6.6625 5.81264 6.9375L3.42514 11.0875C3.27514 11.35 3.32514 11.675 3.57514 11.85L6.11264 13.825C6.05014 14.2 6.00014 14.6125 6.00014 15C6.00014 15.3875 6.02514 15.8 6.08764 16.175L3.55014 18.15C3.32514 18.325 3.26264 18.6625 3.40014 18.9125L5.80014 23.0625C5.95014 23.3375 6.26264 23.425 6.53764 23.3375L9.52514 22.1375C10.1501 22.6125 10.8126 23.0125 11.5501 23.3125L12.0001 26.4875C12.0626 26.7875 12.3001 27 12.6001 27H17.4001C17.7001 27 17.9501 26.7875 17.9876 26.4875L18.4376 23.3125C19.1751 23.0125 19.8501 22.6125 20.4626 22.1375L23.4501 23.3375C23.7251 23.4375 24.0376 23.3375 24.1876 23.0625L26.5876 18.9125C26.7376 18.6375 26.6751 18.325 26.4376 18.15L23.9251 16.175ZM15.0001 19.5C12.5251 19.5 10.5001 17.475 10.5001 15C10.5001 12.525 12.5251 10.5 15.0001 10.5C17.4751 10.5 19.5001 12.525 19.5001 15C19.5001 17.475 17.4751 19.5 15.0001 19.5Z" fill="#FFFDFA"/>
</svg>


                  <p className={`text-white text-xl ${!isOpen && "hidden"} select-none`}>
                    Configurações
                  </p>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}