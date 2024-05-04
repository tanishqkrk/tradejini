"use client";
import "react-toggle/style.css"; // for ES6 modules
import Toggle from "react-toggle";
// import Sun, { Moon } from "lucide-react";
import { MoonIcon, SunIcon } from "../components/Icons";

export function ThemeSwitcher() {
  return (
    <div>
      <Toggle
        className="toggle-hehe"
        icons={{
          checked: <SunIcon />,
          unchecked: <MoonIcon />,
        }}
        id="cheese-status"
        onChange={() => {
          document.documentElement.classList.toggle("dark");
        }}
      />
    </div>
  );
}
