import type { Metadata } from "next";
import { Text_Me_One, Poppins } from "next/font/google";
import "./globals.css";
import { THEME_INIT_SCRIPT } from "@/utils/theme";

const TextMeOne = Text_Me_One({
  variable: "--font-text-me-one",
  weight: "400",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MetamorphIA",
  description: "MetamorphIA",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      data-theme="light"
      suppressHydrationWarning
      className={`${TextMeOne.variable} ${poppins.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full bg-surface-base">{children}</body>
    </html>
  );
}
