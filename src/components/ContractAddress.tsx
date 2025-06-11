import React, { useState } from 'react';
import { Copy, Check, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { CONTRACT_ADDRESS } from '../utils/constants';

const ContractAddress: React.FC = () => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT_ADDRESS);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy contract address:', error);
    }
  };

  const handleViewOnExplorer = () => {
    // Open Solana explorer with the contract address
    window.open(`https://explorer.solana.com/address/${CONTRACT_ADDRESS}`, '_blank');
  };

  const formatAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.7 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-lg">
        <CardContent className="p-6 space-y-4">
          <div className="text-center">
            <h3 className="text-sm font-semibold text-foreground mb-1">Contract Address</h3>
            <p className="text-xs text-muted-foreground">PING Token on Solana</p>
          </div>
          
          <div className="flex items-center gap-3 p-4 bg-background/50 rounded-lg border border-border/50">
            <div className="flex-1 min-w-0">
              <div className="font-mono text-sm text-foreground">
                <span className="hidden md:inline whitespace-nowrap">{CONTRACT_ADDRESS}</span>
                <span className="md:hidden break-all">{formatAddress(CONTRACT_ADDRESS)}</span>
              </div>
            </div>
            
            <div className="flex gap-2 flex-shrink-0">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className={`h-9 w-9 transition-all duration-300 ${
                    isCopied 
                      ? 'bg-green-600 hover:bg-green-600 text-white border-green-600' 
                      : 'hover:bg-primary/10 hover:border-primary/50'
                  }`}
                  title="Copy contract address"
                >
                  <motion.div
                    animate={isCopied ? {
                      scale: [1, 1.2, 1]
                    } : {}}
                    transition={{ 
                      duration: 0.3, 
                      ease: "easeInOut"
                    }}
                  >
                    {isCopied ? <Check size={16} /> : <Copy size={16} />}
                  </motion.div>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleViewOnExplorer}
                  className="h-9 w-9 hover:bg-primary/10 hover:border-primary/50"
                  title="View on Solana Explorer"
                >
                  <ExternalLink size={16} />
                </Button>
              </motion.div>
            </div>
          </div>
          
          {isCopied && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-center"
            >
              <span className="text-xs text-green-600 font-medium">✓ Copied to clipboard!</span>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContractAddress;