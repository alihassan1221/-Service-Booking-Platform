import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import {
  Calendar,
  Home,
  Users,
  UserCircle,
  LayoutDashboard,
} from "lucide-react";

const Sidebar = ({ isSidebarOpen, toggleSidebar, isSidebarCollapsed }) => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isSidebarOpen]);

  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  const userMenuItems = [
    { path: "/my-bookings", label: "My Bookings", icon: Home },
    { path: "/create-booking", label: "Create Booking", icon: Calendar },
  ];

  const managerMenuItems = [
    { path: "/manager", label: "Dashboard", icon: LayoutDashboard },
    { path: "/manager/bookings", label: "All Bookings", icon: Calendar },
  ];

  const adminMenuItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { path: "/admin/users", label: "User Management", icon: Users },
    { path: "/admin/managers", label: "Manager Management", icon: UserCircle },
    { path: "/manager/bookings", label: "All Bookings", icon: Calendar },
  ];

  const getMenuItems = () => {
    switch (user.role) {
      case "manager":
        return managerMenuItems;
      case "admin":
        return adminMenuItems;
      default:
        return userMenuItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside
      className={`bg-white dark:bg-gray-900 h-screen shadow-lg transition-all duration-300 fixed left-0 top-0 bottom-0 z-40 pt-16
        ${isSidebarCollapsed ? "w-20" : "w-64"}
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
    >
      <nav className="p-4 mt-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      toggleSidebar();
                    }
                  }}
                  className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                    isActiveLink(item.path)
                      ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-r-2 border-blue-500 whitespace-nowrap"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 whitespace-nowrap"
                  }`}
                >
                  <IconComponent
                    className={`w-5 h-5 flex-shrink-0 ${
                      isSidebarCollapsed ? "mx-auto" : "mr-3"
                    } ${
                      isActiveLink(item.path)
                        ? "text-blue-500"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  />
                  {!isSidebarCollapsed && (
                    <span className="font-medium flex-shrink-0">
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
