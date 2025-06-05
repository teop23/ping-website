import React from 'react';
import { Rocket, Palette } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white py-4 px-6 md:px-12 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Rocket className="text-yellow-400" size={32} />
          <span className="font-bold text-2xl tracking-tighter">PING</span>
        </motion.div>
        
        <div className="flex items-center space-x-8">
          <NavItem label="Home" href="/" isActive={location.pathname === '/'} />
          <NavItem 
            label="Create Traits" 
            href="/create-traits" 
            isActive={location.pathname === '/create-traits'}
            icon={<Palette size={16} />} 
          />
        </div>
      </div>
    </nav>
  );
};

interface NavItemProps {
  label: string;
  href: string;
  isActive?: boolean;
  icon?: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ label, href, isActive = false, icon }) => {
  return (
    <motion.a
      href={href}
      className={`${isActive ? 'text-yellow-400 font-medium' : 'text-white hover:text-yellow-200'} 
                 transition-colors duration-200 flex items-center gap-2`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
      {label}
    </motion.a>
  );
};

export default Navbar;