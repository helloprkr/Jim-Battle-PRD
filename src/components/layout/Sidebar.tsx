import { NavLink } from 'react-router-dom';
import { 
  Home,
  Heart,
  Utensils,
  Briefcase,
  BarChart,
  Users,
  Settings
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', to: '/', icon: Home },
  { name: 'Health', to: '/health', icon: Heart },
  { name: 'Nutrition', to: '/nutrition', icon: Utensils },
  { name: 'Projects', to: '/projects', icon: Briefcase },
  { name: 'Analytics', to: '/analytics', icon: BarChart },
  { name: 'Relationships', to: '/relationships', icon: Users },
];

export const Sidebar = () => {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-slate-800/50 backdrop-blur-sm">
          <div className="flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    className={({ isActive }) =>
                      `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                        isActive
                          ? 'bg-slate-700 text-white'
                          : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </NavLink>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-slate-700 p-4">
            <NavLink
              to="/settings"
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-slate-700 hover:text-white"
            >
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};