import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LogOut, User, ChevronDown, Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { logout } from '../../store/slices/authSlice';

const Navbar = ({ toggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="w-full bg-gray-50 dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
      <Link to="/" className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
          <span className="text-white font-bold text-lg">SB</span>
        </div>
        <span className="text-xl font-bold text-gray-800 dark:text-white">
          ServiceBooking
        </span>
      </Link>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>

        {user && (
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-medium">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden md:block text-gray-700 dark:text-gray-200 font-medium">
                {user.name}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  isProfileOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden py-1">
                <Link
                  to="/profile"
                  className="flex items-center px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => setIsProfileOpen(false)}
                >
                  <User className="w-4 h-4 mr-3" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;