import { Inter } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tradejini",
  description: "...",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className="bg-theme p-6">
          <Image width={150} height={150} src="/logo_long.svg" alt="" />
        </header>
        <div>{children}</div>
      </body>
    </html>
  );
}
