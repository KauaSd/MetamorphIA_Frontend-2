import { twMerge } from 'tailwind-merge';

type ButtonProps = {
    children: React.ReactNode;
    className?: string,
    type?: "button" | "submit";
};

export default function Button({ 
        children,
        type = "button",
        className,
        ...props
    }: ButtonProps){
    return(
        <button 
        type={type}
        className={twMerge(`w-full rounded-[70px] bg-[#D4C7F8] px-5 {}
            py-2 text-[#433F3F] hover:bg-[#AB97E0] cursor-pointer`, className)} {...props}>
            {children}
        </button>
    );
}