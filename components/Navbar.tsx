import Link from "next/link";

export default function Navbar() {
  return (
    <header className=" py-4 p-3">
      <div className="relative w-full h-full p-[1px] rounded-2xl">
        <div className="flex justify-between items-center px-10 rounded-2xl py-6">
          <img src="/logo_long.svg" className="w-36 dark:hidden block" alt="" />
          <img src="/logo.svg" className="w-36 dark:block hidden" alt="" />
          <div className="rounded-full bg-[#19ad63] py-1 px-0.5 flex flex-row gap-x-4">
            <Link
              className="rounded-full bg-white text-black px-5 py-3 shadow-2xl"
              href={"#"}
            >
              Home
            </Link>
            <Link className="px-8 py-3 text-white rounded-full" href="#">
              About
            </Link>
            <Link className="px-8 py-3 text-white rounded-full" href="#">
              Pricing
            </Link>
            <Link className="px-8 py-3 text-white rounded-full" href="#">
              Jinversity
            </Link>
            <Link className="px-8 py-3 text-white rounded-full" href="#">
              Media
            </Link>
            <Link className="px-8 py-3 text-white rounded-full" href="#">
              Support
            </Link>
          </div>
          <div className="flex flex-row gap-x-4 items-center">
            <Link
              href="#"
              className="border-[#19ad63] border-2 text-[#19ad63] font-bold px-5 py-2 rounded-xl"
            >
              Login
            </Link>
            <Link
              href="#"
              className="border-[#19ad63] border-2 bg-[#19ad63] text-white font-bold px-5 py-2 rounded-xl"
            >
              Signup
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
