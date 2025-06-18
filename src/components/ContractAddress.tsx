import React, { useState } from 'react';
import { Copy, Check, ExternalLink, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { CONTRACT_ADDRESS, BUY_LINK } from '../utils/constants';

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

  const handleBuyToken = () => {
    // Open buy link in new tab
    window.open(BUY_LINK, '_blank');
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
      className="w-full max-w-lg mx-auto"
    >
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20 shadow-lg">
        <CardContent className="p-3">
          <div className="space-y-3">
            {/* Contract Address Section */}
            <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg border border-border/50">
            <div className="flex-1 min-w-0">
              <div className="font-mono text-sm text-foreground">
                <span className="hidden sm:inline whitespace-nowrap">{CONTRACT_ADDRESS}</span>
                <span className="sm:hidden break-all">{formatAddress(CONTRACT_ADDRESS)}</span>
              </div>
            </div>
            
            <div className="flex gap-1 flex-shrink-0">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className={`h-8 w-8 transition-all duration-300 ${
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
                    {isCopied ? <Check size={14} /> : <Copy size={14} />}
                  </motion.div>
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleViewOnExplorer}
                  className="h-8 w-8 hover:bg-primary/10 hover:border-primary/50"
                  title="View on Solana Explorer"
                >
                  <ExternalLink size={14} />
                </Button>
              </motion.div>
            </div>
          </div>
            
            {/* Buy Button Section */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleBuyToken}
                className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition-all duration-300"
              >
                <ShoppingCart size={18} className="mr-2" />
                Buy $PING
              </Button>
            </motion.div>
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