import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
import { Menu } from "lucide-react";

const Layout = () => {
  const { user } = useSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar toggleSidebar={toggleSidebar} />
      <div className="flex flex-1 pt-16">
        {user && (
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            isSidebarCollapsed={isSidebarCollapsed}
            toggleSidebarCollapse={toggleSidebarCollapse}
          />
        )}
        <main
          className={`flex-1 overflow-x-hidden overflow-y-auto p-6 transition-all duration-300 ${
            user ? (isSidebarCollapsed ? "lg:ml-20" : "lg:ml-64") : "ml-0"
          }`}
        >
          <div className="container mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
