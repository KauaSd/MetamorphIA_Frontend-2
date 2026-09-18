import Link from "next/link";
import Button from "@/components/common/Button";
import Logo from "@/public/icon.png";

export default function Header(){
    return(
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
    )
}