import Logo from "@/public/icon.png";
import { Poppins, Text_Me_One } from "next/font/google";
const TextMeOne = Text_Me_One({
    variable: "--font-text-me-one",
    weight: "400",
    subsets: ["latin"],
});
const poppins = Poppins({
    variable: "--font-poppins",
    weight: "400",
    subsets: ["latin"],
});

export default function Logged({
    children,
}:{
    children: React.ReactNode;
}){
    return(
        <div className={`relative min-h-screen overflow-hidden bg-[#F0F0F0]`}>
            
            
                <main className={`flex-1 ${poppins.variable} font-(family-name:--font-poppins)`}>
                    {children}
                </main>
            </div>
            
    )
}