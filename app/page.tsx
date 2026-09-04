import Image from "next/image";
import Link from "next/link"
export default function Home() {
  return (
<div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans">
  <main className="flex flex-1 w-full max-w-3xla items-center justify-center py-32 px-1">
    <div className="flex w-full justify-center max-w-md gap-12">
      <Link href="auth/login">
        <button className="px-10 py-2 bg-[#D4C7F8] rounded-2xl text-xl text-[#433F3F] cursor-pointer">
        <span>login</span>
        </button>
      </Link>

      <Link href="auth/cadastro">
        <button className="px-10 py-2 bg-[#D4C7F8] rounded-2xl text-xl text-[#433F3F] cursor-pointer"> 
          <span>cadastro</span>
        </button>
      </Link>

    </div>
  </main >
</div>
      
    
  );
}
