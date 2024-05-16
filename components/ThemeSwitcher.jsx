"use client";
import "react-toggle/style.css"; // for ES6 modules
import Toggle from "react-toggle";
import { MoonIcon, SunIcon } from "../components/Icons";

export function ThemeSwitcher() {
  return (
    <div className="mr-10">
      <Toggle
        defaultChecked
        className="toggle-hehe mr-5"
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
