import { twMerge } from 'tailwind-merge';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
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
      className={twMerge(
        "w-full rounded-[70px] bg-[#D4C7F8] px-4 py-1.5 sm:px-5 sm:py-2 text-sm sm:text-base text-[#433F3F] hover:bg-[#AB97E0] cursor-pointer transition-colors",
        className
      )} 
      {...props}
    >
      {children}
    </button>
  );
}