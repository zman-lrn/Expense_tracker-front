import { FaHome, FaDollarSign, FaMoneyBillWave } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function BottomNavigation() {
  const navItems = [
    {
      name: "Home",
      icon: <FaHome className="text-lg sm:text-xl" />,
      path: "/",
    },
    {
      name: "Income",
      icon: <FaDollarSign className="text-lg sm:text-xl" />,
      path: "/income",
    },
    {
      name: "Expense",
      icon: <FaMoneyBillWave className="text-lg sm:text-xl" />,
      path: "/expense",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md border-t border-gray-200 z-50">
      <ul className="flex justify-around items-center py-1 sm:py-2">
        {navItems.map((item) => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center 
                 px-2 py-1 sm:px-4 sm:py-2 
                 rounded-md transition-colors
                 text-[10px] sm:text-xs
                 ${
                   isActive
                     ? "bg-blue-100 text-blue-500"
                     : "text-gray-700 hover:text-blue-500 hover:bg-gray-100"
                 }`
              }
            >
              {item.icon}
              <span className="mt-0.5 sm:mt-1">{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
