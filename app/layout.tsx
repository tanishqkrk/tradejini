import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "../components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tradejini",
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
        <Navbar />

        {children}
      </body>
    </html>
  );
}
