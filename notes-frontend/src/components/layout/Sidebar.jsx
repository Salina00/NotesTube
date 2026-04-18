import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Library, History, ThumbsUp, Code, BookOpen, GraduationCap, FileText } from 'lucide-react';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();

  const primaryLinks = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Explore', icon: Compass, path: '/explore' },
    { name: 'Library', icon: Library, path: '/profile/me' },
  ];

  const secondaryLinks = [
    { name: 'Saved Notes', icon: BookOpen, path: '/saved' },
    { name: 'History', icon: History, path: '/history' },
    { name: 'Liked Notes', icon: ThumbsUp, path: '/liked' },
  ];

  const categories = [
    { name: 'Engineering', icon: Code },
    { name: 'Programming', icon: Code },
    { name: 'Exams', icon: GraduationCap },
    { name: 'General Notes', icon: FileText },
    { name: 'Science', icon: BookOpen },
  ];

  if (!isOpen) return null;

  return (
    <aside className="w-64 fixed left-0 top-16 bottom-0 bg-surface-color z-40 overflow-y-auto hidden md:block border-r border-border-color transition-colors duration-300">
      <div className="p-3">
        
        <div className="space-y-1 mb-4">
          {primaryLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-4 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-black/10 dark:bg-white/10 font-medium' 
                    : 'hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-text-primary' : 'text-text-secondary'}`} />
                <span className={`text-sm ${isActive ? 'text-text-primary' : 'text-text-primary'}`}>
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="h-px bg-border-color my-3 mx-2"></div>

        <div className="space-y-1 mb-4">
          <h3 className="px-3 py-2 text-sm font-semibold text-text-primary">You</h3>
          {secondaryLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                className="flex items-center gap-4 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                <Icon className="w-5 h-5 text-text-secondary" />
                <span className="text-sm text-text-primary">{link.name}</span>
              </Link>
            );
          })}
        </div>

        <div className="h-px bg-border-color my-3 mx-2"></div>

        <div className="space-y-1">
          <h3 className="px-3 py-2 text-sm font-semibold text-text-primary">Categories</h3>
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.name}
                className="w-full flex items-center gap-4 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
              >
                <div className="w-6 h-6 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center">
                  <Icon className="w-3.5 h-3.5 text-text-secondary" />
                </div>
                <span className="text-sm text-text-primary truncate">{category.name}</span>
              </button>
            );
          })}
        </div>

      </div>
    </aside>
  );
};

export default Sidebar;
