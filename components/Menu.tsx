"use client";

import Icon from "@/public/icon.png";
import { ChevronDown } from "lucide-react";
import React from "react";

export default function Menu() {
  const [isOpen, setIsOpen] = React.useState(true);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setIsOpen(false);
      } else if (window.innerWidth >= 1400) {
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
      {/* Backdrop: só aparece no mobile quando o menu está aberto (overlay) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`bg-[#433F3F] shrink-0 h-screen fixed inset-y-0 left-0 z-50 md:static md:z-auto ${
          isOpen ? "w-75" : "w-20 cursor-pointer"
        } flex flex-col transition-all duration-300 ease-in-out`}
        onClick={() => {
          if (!isOpen) {
            setIsOpen(true);
          }
        }}
      >
        <div className="flex flex-col p-5 w-full h-screen">

          <div
            className={`flex flex-row items-center ${
              isOpen ? "justify-between" : "justify-center"
            }`}
          >
            <div className="flex gap-1 items-center">
              <img
                src={Icon.src}
                alt=""
                className="h-10 w-10 pointer-events-none select-none"
              />

              <h1
                className={`text-[#FFFDFA] text-3xl font-(family-name:--font-text-me-one) ${
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
                <line
                  x1="8.92676"
                  x2="8.92676"
                  y2="20"
                  stroke="white"
                />
              </svg>
            </div>
          </div>

          <div className="h-px w-full bg-[#FFFDFA] my-5" />

          <div
            className={`flex flex-col ${
              isOpen ? "gap-3" : "gap-0"
            }`}
          >

            {/* TURMAS */}
            <div className="flex flex-col w-full">
              <div
                className={`h-[35px] flex items-center cursor-pointer ${
                  isOpen
                    ? "w-full justify-between"
                    : "w-[30px] justify-center mx-auto"
                }`}
              >
                <div className="flex items-center gap-4">
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

                  <p
                    className={`text-white text-xl ${
                      !isOpen && "hidden"
                    }`}
                  >
                    Turmas
                  </p>
                </div>

                <ChevronDown
                  className={`w-7.5 h-7.5 text-[#FFFDFA] shrink-0 ${
                    !isOpen && "hidden"
                  }`}
                />
              </div>

              {!isOpen && (
                <div className="h-px w-full bg-[#FFFDFA] mt-1" />
              )}
            </div>

            {!isOpen && <div className="h-5" />}

            {/* ALUNOS */}
            <div className="flex flex-col w-full">
              <div
                className={`h-[35px] flex items-center cursor-pointer ${
                  isOpen
                    ? "w-full justify-between"
                    : "w-[30px] justify-center mx-auto"
                }`}
              >
                <div className="flex items-center gap-4">
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

                  <p
                    className={`text-white text-xl ${
                      !isOpen && "hidden"
                    }`}
                  >
                    Alunos
                  </p>
                </div>

                <ChevronDown
                  className={`w-7.5 h-7.5 text-[#FFFDFA] shrink-0 ${
                    !isOpen && "hidden"
                  }`}
                />
              </div>

              {!isOpen && (
                <div className="h-px w-full bg-[#FFFDFA] mt-1" />
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}