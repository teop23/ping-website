/* eslint-disable @typescript-eslint/no-empty-object-type */
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Palette, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { SOCIAL_LINKS } from '../utils/constants';
import pingIcon from '../assets/ping_transparent_icon.png';

// Twitter/X icon component
const TwitterIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Telegram icon component
const TelegramIcon: React.FC<{ size?: number; className?: string }> = ({ size = 20, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

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
            className="flex items-center space-x-3 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <a href="/" className="flex items-center space-x-2">
              <img 
                src={pingIcon} 
                alt="PING" 
                className="w-6 h-6 sm:w-7 sm:h-7 opacity-90"
              />
              <span className="font-bold text-xl sm:text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">PING</span>
            </a>
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
            
            {/* Social Links */}
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-border/50">
              <SocialLink 
                href={SOCIAL_LINKS.TWITTER}
                icon={<TwitterIcon size={18} />}
                label="Twitter"
              />
              <SocialLink 
                href={SOCIAL_LINKS.TELEGRAM}
                icon={<TelegramIcon size={18} />}
                label="Telegram"
              />
            </div>
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
                
                {/* Mobile Social Links */}
                <div className="pt-2 mt-2 border-t border-border/50">
                  <div className="flex justify-center space-x-4">
                    <SocialLink 
                      href={SOCIAL_LINKS.TWITTER}
                      icon={<TwitterIcon size={20} />}
                      label="Twitter"
                      isMobile
                    />
                    <SocialLink 
                      href={SOCIAL_LINKS.TELEGRAM}
                      icon={<TelegramIcon size={20} />}
                      label="Telegram"
                      isMobile
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isMobile?: boolean;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, label, isMobile = false }) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "transition-colors duration-200 hover:text-primary",
        isMobile 
          ? "flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-muted text-muted-foreground" 
          : "text-muted-foreground hover:text-primary"
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={label}
    >
      {icon}
      {isMobile && <span className="text-xs font-medium">{label}</span>}
    </motion.a>
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