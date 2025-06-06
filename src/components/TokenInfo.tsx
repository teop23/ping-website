import React from 'react';
import { motion } from 'framer-motion';
import { Coins, TrendingUp, Users, Globe } from 'lucide-react';
import { Card, CardHeader, CardContent } from './ui/card';
import { Button } from './ui/button';

const TokenInfo: React.FC = () => {
  return (
    <motion.div 
      className="overflow-hidden w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Coins className="text-primary" size={24} />
            <div>
              <h2 className="text-xl font-bold">PING Token</h2>
              <p className="text-muted-foreground">The official token of the Ping community</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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
            <Button className="w-full" asChild>
              <a href="#" className="flex items-center justify-center gap-2">
                <Globe size={18} />
                View on Explorer
              </a>
            </Button>
            
            <p className="text-sm text-muted-foreground mt-4">
              $PING is a Solana-based memetoken inspired by our customizable character.
              Join our community and collect your unique Ping NFT by customizing your character!
            </p>
          </div>
        </CardContent>
      </Card>
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
    <Card className="p-4 flex flex-col items-center justify-center">
      <div className="flex items-center justify-center mb-2">
        {icon}
      </div>
      <div className="text-center">
        <p className="text-muted-foreground text-sm">{label}</p>
        <p className="font-bold text-lg">{value}</p>
      </div>
    </Card>
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