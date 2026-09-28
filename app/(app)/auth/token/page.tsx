import { FormToken } from "@/components/app/forms/FormAuth";

export default function Token() {
  return (
    <div className="flex flex-1 flex-col justify-center">
      <div className="relative flex w-full items-stretch justify-center overflow-hidden px-4 sm:px-6">
        <img
          className="z-10 w-auto max-w-[18vw] shrink-0 self-stretch -mr-3 object-contain pointer-events-none select-none sm:-mr-4 md:-mr-6"
          src="/encaracoladoLogin.svg"
          alt=""
        />
        <FormToken/>
      </div>
    </div>
  );
}