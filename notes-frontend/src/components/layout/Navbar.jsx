import { Link } from 'react-router-dom';
import { Search, Menu, Upload, Moon, Sun, UserCircle, Bell } from 'lucide-react';

const Navbar = ({ toggleTheme, isDarkMode, toggleSidebar }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-surface-color border-b border-border-color z-50 flex items-center px-4 justify-between transition-colors duration-300">
      
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
          <Menu className="w-6 h-6 text-text-primary" />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
            N
          </div>
          <span className="text-xl font-bold tracking-tight text-text-primary hidden sm:block">NotesTube</span>
        </Link>
      </div>

      <div className="flex-1 max-w-2xl px-4 flex justify-center hidden sm:flex">
        <div className="flex w-full max-w-[600px] items-center border border-border-color rounded-full overflow-hidden bg-bg-color hover:border-gray-400 dark:hover:border-gray-500 transition-colors shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 ml-8">
          <input 
            type="text" 
            placeholder="Search for notes, subjects, or tags..." 
            className="w-full bg-transparent px-4 py-2 outline-none text-text-primary"
          />
          <button className="px-5 py-2 bg-black/5 dark:bg-white/5 border-l border-border-color hover:bg-black/10 dark:hover:bg-white/10 transition-colors">
            <Search className="w-5 h-5 text-text-secondary" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button className="sm:hidden p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
          <Search className="w-6 h-6 text-text-primary" />
        </button>
        
        <Link to="/upload" className="flex items-center gap-2 px-3 py-2 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors">
          <Upload className="w-5 h-5 text-text-primary" />
          <span className="hidden md:block text-sm font-medium text-text-primary">Upload</span>
        </Link>

        <button onClick={toggleTheme} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
          {isDarkMode ? <Sun className="w-6 h-6 text-text-primary" /> : <Moon className="w-6 h-6 text-text-primary" />}
        </button>

        <button className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors hidden md:block">
          <Bell className="w-6 h-6 text-text-primary" />
        </button>

        <Link to="/profile/me" className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors ml-2">
          <UserCircle className="w-8 h-8 text-blue-500" />
        </Link>
      </div>

    </nav>
  );
};

export default Navbar;
