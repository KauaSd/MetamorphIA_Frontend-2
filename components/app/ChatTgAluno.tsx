export default function ChatTgAluno() {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        sm:gap-5
        w-[84vw]
        sm:w-80
        max-w-86
        h-16
        sm:h-20
        px-3
        sm:px-4
        bg-[#FFFDFA]
        rounded-[70px]
      "
    >
      {/* Avatar */}
      <div
        className="
          flex
          items-center
          justify-center
          w-14
          h-14
          sm:w-17.5
          sm:h-17.5
          shrink-0
          bg-[#D4C7F8]
          rounded-full
        "
      >
        <p className="font-bold text-xl sm:text-3xl text-[#433F3F]">
          LO
        </p>
      </div>

      {/* Informações */}
      <div className="flex flex-col flex-1 min-w-0 gap-1">

        <p className="font-bold text-sm sm:text-base text-[#433F3F] truncate">
          Lucas Olioti
        </p>

        <div className="flex items-center gap-5 min-w-0">
          <p className="font-bold text-sm text-[#797979] shrink-0">
            TDAH
          </p>

          <div className="min-w-0 flex-1">
            <div
              className="
                flex
                items-center
                justify-center
                w-full
                max-w-27
                h-6
                rounded-full
                bg-[#FFD279]
              "
            >
              <p className="font-bold text-sm text-[#433F3F] whitespace-nowrap">
                PEI ativo
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}