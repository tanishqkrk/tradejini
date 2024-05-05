import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="dark" lang="en">
      <body
        className={`${inter.className} bg-black text-white dark:text-black dark:bg-white`}
      >
        <header className="bg-gradient-to-b py-6 pb-16 from-[#107C5D] to-[#0A3838] p-3">
          <div className="relative w-full h-full  bg-gradient-to-t from-zinc-400 to-zinc-100 p-[1px] rounded-2xl dark:to-zinc-300 dark:from-zinc-400">
            <div className="flex justify-between items-center p-3 rounded-2xl py-6 shadow-2xl bg-gradient-to-b from-[#107C5D] to-[#0e4d4d]">
              <img src="/logo_long.svg" className="w-36" alt="" />
            </div>
          </div>
        </header>

        {children}
      </body>
    </html>
  );
}
