import React from 'react';
import { motion } from 'framer-motion';
import { Coins, TrendingUp, Users, Globe } from 'lucide-react';

const TokenInfo: React.FC = () => {
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 text-white">
        <h2 className="text-xl font-bold flex items-center">
          <Coins className="mr-2" size={24} />
          BONJI Token
        </h2>
        <p className="text-purple-100 mt-1">The official token of the Bonji community</p>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard
            icon={<TrendingUp size={20} className="text-green-500" />}
            label="Current Price"
            value="$0.00042"
          />
          <StatCard
            icon={<Coins size={20} className="text-yellow-500" />}
            label="Market Cap"
            value="$420,000"
          />
          <StatCard
            icon={<Users size={20} className="text-blue-500" />}
            label="Holders"
            value="2,345"
          />
        </div>
        
        <div className="space-y-4">
          <LinkButton 
            icon={<Globe size={18} />}
            label="View on Explorer"
            href="#"
          />
          
          <p className="text-sm text-gray-600 mt-4">
            $BONJI is a Solana-based memetoken inspired by our customizable character.
            Join our community and collect your unique Bonji NFT by customizing your character!
          </p>
        </div>
      </div>
    </motion.div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center">
      <div className="flex items-center justify-center mb-2">
        {icon}
      </div>
      <div className="text-center">
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="font-bold text-lg">{value}</p>
      </div>
    </div>
  );
};

interface LinkButtonProps {
  icon: React.ReactNode;
  label: string;
  href: string;
}

const LinkButton: React.FC<LinkButtonProps> = ({ icon, label, href }) => {
  return (
    <motion.a
      href={href}
      className="flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-6 rounded-lg shadow-md w-full"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {icon}
      <span>{label}</span>
    </motion.a>
  );
};

export default TokenInfo;