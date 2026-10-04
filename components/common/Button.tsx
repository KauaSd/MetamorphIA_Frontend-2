import { twMerge } from 'tailwind-merge';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
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
      className={twMerge(
        "w-full rounded-[70px] bg-surface-accent px-4 py-1.5 sm:px-5 sm:py-2 text-sm sm:text-base text-ink hover:bg-surface-accent-strong cursor-pointer transition-colors disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-surface-accent",
        className
      )} 
      {...props}
    >
      {children}
    </button>
  );
}