import Link from "next/link";

export default function Navbar() {
  return (
    <header className="p-4">
      <div className="relative h-full w-full rounded-2xl p-[1px]">
        <div className="flex items-center justify-between rounded-2xl px-10 py-6">
          <img src="/logo_long.svg" className="block w-36 dark:hidden" alt="" />
          <img src="/logo.svg" className="hidden w-36 dark:block" alt="" />
          <div className="flex flex-row gap-x-4 rounded-full bg-[#19ad63] px-0.5 py-1">
            <Link
              className="rounded-full bg-white px-5 py-3 text-black shadow-2xl"
              href={"#"}
            >
              Home
            </Link>
            <Link className="rounded-full px-8 py-3 text-white" href="#">
              About
            </Link>
            <Link className="rounded-full px-8 py-3 text-white" href="#">
              Pricing
            </Link>
            <Link className="rounded-full px-8 py-3 text-white" href="#">
              Jinversity
            </Link>
            <Link className="rounded-full px-8 py-3 text-white" href="#">
              Media
            </Link>
            <Link className="rounded-full px-8 py-3 text-white" href="#">
              Support
            </Link>
          </div>
          <div className="flex flex-row items-center gap-x-4">
            <Link
              href="#"
              className="rounded-xl border-2 border-[#19ad63] px-5 py-2 font-bold text-[#19ad63]"
            >
              Login
            </Link>
            <Link
              href="#"
              className="rounded-xl border-2 border-[#19ad63] bg-[#19ad63] px-5 py-2 font-bold text-white"
            >
              Signup
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
