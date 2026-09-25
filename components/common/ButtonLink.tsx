import Link from "next/link";
import { twMerge } from "tailwind-merge";

interface ButtonLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
}

export default function ButtonLink({
  href,
  className,
  children,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={twMerge(
        "inline-flex w-full items-center justify-center rounded-[70px] bg-[#D4C7F8] px-4 py-1.5 sm:px-5 sm:py-2 text-sm sm:text-base text-[#433F3F] hover:bg-[#AB97E0] cursor-pointer transition-colors",
        className,
      )}
    >
      {children}
    </Link>
  );
}