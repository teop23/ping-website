import React from 'react';
import { Twitter, Github, Disc as Discord, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">PING</h3>
            <p className="text-gray-400 mb-4">
              The fun, customizable Solana memetoken that lets you create unique characters and join a vibrant community.
            </p>
            <div className="flex space-x-4">
              <SocialLink icon={<Twitter size={20} />} href="#" />
              <SocialLink icon={<Discord size={20} />} href="#" />
              <SocialLink icon={<Github size={20} />} href="#" />
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Links</h4>
            <ul className="space-y-2">
              <FooterLink label="Home" href="#" />
              <FooterLink label="Character Builder" href="#" />
              <FooterLink label="Token Info" href="#" />
              <FooterLink label="FAQ" href="#" />
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <FooterLink label="Whitepaper" href="#" />
              <FooterLink label="Tokenomics" href="#" />
              <FooterLink label="Roadmap" href="#" />
              <FooterLink label="Community" href="#" />
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} PING. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center">
            Made with <Heart size={14} className="mx-1 text-red-500" /> on Solana
          </p>
        </div>
      </div>
    </footer>
  );
};

interface SocialLinkProps {
  icon: React.ReactNode;
  href: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ icon, href }) => {
  return (
    <a 
      href={href} 
      className="bg-gray-800 hover:bg-indigo-600 transition-colors duration-200 p-2 rounded-full"
    >
      {icon}
    </a>
  );
};

interface FooterLinkProps {
  label: string;
  href: string;
}

const FooterLink: React.FC<FooterLinkProps> = ({ label, href }) => {
  return (
    <li>
      <a 
        href={href} 
        className="text-gray-400 hover:text-indigo-400 transition-colors duration-200"
      >
        {label}
      </a>
    </li>
  );
};

export default Footer;