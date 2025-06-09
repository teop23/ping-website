/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Palette, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';

interface NavbarProps extends React.HTMLAttributes<HTMLElement> {}

const Navbar: React.FC<NavbarProps> = ({ className, ...props }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className={cn("bg-gradient-to-b from-background/95 to-background/90 backdrop-blur-lg border-b border-border/50 px-4 sm:px-6 md:px-12 relative flex items-center shadow-sm z-50", className)} {...props}>
        <div className="w-full flex justify-between items-center">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            whileHover={{ scale: 1.05 }}
          >
            <a href="/" className="font-bold text-xl sm:text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">PING</a>
          </motion.div>
          
          {/* Center Title - Hidden on mobile when menu is open */}
          <div className={cn(
            "absolute left-1/2 transform -translate-x-1/2 transition-opacity duration-300",
            isMobileMenuOpen ? "opacity-0 pointer-events-none" : "opacity-100"
          )}>
            {location.pathname === '/create-traits' && (
              <h1 className="text-sm sm:text-lg md:text-xl font-semibold">Create PING Traits</h1>
            )}
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <NavItem label="Home" href="/" isActive={location.pathname === '/'} />
            <NavItem 
              label="Create Traits" 
              href="/create-traits" 
              isActive={location.pathname === '/create-traits'}
              icon={<Palette size={16} />} 
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="relative z-50"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={20} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={20} />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMobileMenu}
            />
            
            {/* Mobile Menu */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed top-16 left-4 right-4 bg-background/95 backdrop-blur-lg border border-border/50 rounded-lg shadow-lg z-50 md:hidden"
            >
              <div className="p-4 space-y-2">
                <MobileNavItem 
                  label="Home" 
                  href="/" 
                  isActive={location.pathname === '/'} 
                  onClick={closeMobileMenu}
                />
                <MobileNavItem 
                  label="Create Traits" 
                  href="/create-traits" 
                  isActive={location.pathname === '/create-traits'}
                  icon={<Palette size={18} />}
                  onClick={closeMobileMenu}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

interface NavItemProps {
  label: string;
  href: string;
  isActive?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const NavItem: React.FC<NavItemProps> = ({ label, href, isActive = false, icon, className }) => {
  return (
    <Button
      asChild
      variant={isActive ? "secondary" : "ghost"}
      className={cn("transition-all duration-200", className)}
    >
      <motion.a
        href={href}
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

interface MobileNavItemProps extends NavItemProps {
  onClick: () => void;
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({ label, href, isActive = false, icon, onClick }) => {
  return (
    <motion.a
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 w-full",
        isActive 
          ? "bg-primary/10 text-primary border border-primary/20" 
          : "hover:bg-muted text-muted-foreground hover:text-foreground"
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {icon}
      <span className="font-medium">{label}</span>
      {isActive && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-auto w-2 h-2 bg-primary rounded-full"
        />
      )}
    </motion.a>
  );
};

export default Navbar;