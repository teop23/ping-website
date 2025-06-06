import React from 'react';
import { Rocket, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Button } from './ui/button';

interface NavbarProps extends React.HTMLAttributes<HTMLElement> {}

const Navbar: React.FC<NavbarProps> = ({ className, ...props }) => {
  return (
    <nav className={cn("bg-gradient-to-b from-background/95 to-background/90 backdrop-blur-lg border-b border-border/50 px-6 md:px-12 relative flex items-center shadow-sm", className)} {...props}>
      <div className="container mx-auto flex justify-between items-center">
        <motion.div 
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          whileHover={{ scale: 1.05 }}
        >
          <span className="font-bold text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">PING</span>
        </motion.div>
        
        <div className="absolute left-1/2 transform -translate-x-1/2">
          {location.pathname === '/create-traits' && (
            <h1 className="text-xl font-semibold">Create PING Traits</h1>
          )}
        </div>
        
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
    <Button
      asChild
      variant={isActive ? "secondary" : "ghost"}
      href={href}
    >
      <motion.a
        className="flex items-center gap-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {icon}
        {label}
      </motion.a>
    </Button>
  );
};

export default Navbar;