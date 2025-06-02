// src/components/Tabs.tsx
import { NavLink } from "react-router-dom";

export default function Tabs() {
  const baseClass =
    "px-3 py-1 rounded-md text-sm md:text-base font-medium transition-colors";
  const activeClass = "bg-white text-black";
  const inactiveClass = "bg-gray-700 text-gray-300 hover:bg-gray-600";

  return (
    <nav className="flex justify-center space-x-2 mt-4">
      <NavLink
        to="/lunch"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        점심메뉴
      </NavLink>
      <NavLink
        to="/dinner"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        저녁메뉴
      </NavLink>
      <NavLink
        to="/night"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        술안주 & 야식
      </NavLink>
      <NavLink
        to="/custom"
        className={({ isActive }) =>
          `${baseClass} ${isActive ? activeClass : inactiveClass}`
        }
      >
        내가 만드는 돌림판
      </NavLink>
    </nav>
  );
}
