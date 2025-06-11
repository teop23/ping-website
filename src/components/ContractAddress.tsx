import React, { useState } from 'react';
import { Copy, Check, ExternalLink, Shield } from 'lucide-react';
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
    window.open(`https://explorer.solana.com/address/${CONTRACT_ADDRESS}`, '_blank');
  };

  const formatAddress = (address: string) => {
    if (address.length <= 12) return address;
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.7 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700/50 shadow-2xl">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 animate-pulse" />
        
        {/* Glowing border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-lg blur-sm" />
        
        <CardContent className="relative p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"
            >
              <Shield className="w-5 h-5 text-white" />
            </motion.div>
            <div className="text-center">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                Contract Address
              </h3>
              <p className="text-sm text-slate-400">PING Token on Solana</p>
            </div>
          </div>
          
          {/* Contract Address Display */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-md group-hover:blur-lg transition-all duration-300" />
            
            <div className="relative bg-slate-800/80 backdrop-blur-sm border border-slate-600/50 rounded-xl p-4 group-hover:border-slate-500/70 transition-all duration-300">
              {/* Address text */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-base font-medium text-slate-200 tracking-wider">
                    {/* Desktop view - full address */}
                    <span className="hidden lg:block break-all leading-relaxed">
                      {CONTRACT_ADDRESS}
                    </span>
                    {/* Tablet view - slightly truncated */}
                    <span className="hidden md:block lg:hidden break-all">
                      {CONTRACT_ADDRESS.slice(0, 32)}...{CONTRACT_ADDRESS.slice(-16)}
                    </span>
                    {/* Mobile view - more truncated */}
                    <span className="block md:hidden">
                      {formatAddress(CONTRACT_ADDRESS)}
                    </span>
                  </div>
                  
                  {/* Network badge */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-xs text-slate-400 font-medium">Solana Mainnet</span>
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="flex gap-2 flex-shrink-0">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleCopy}
                      className={`h-10 w-10 transition-all duration-300 border-slate-600 ${
                        isCopied 
                          ? 'bg-green-600 hover:bg-green-600 text-white border-green-600 shadow-lg shadow-green-600/25' 
                          : 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white hover:border-slate-500 hover:shadow-lg hover:shadow-blue-500/25'
                      }`}
                      title="Copy contract address"
                    >
                      <motion.div
                        animate={isCopied ? {
                          scale: [1, 1.2, 1],
                          rotate: [0, 360]
                        } : {}}
                        transition={{ 
                          duration: 0.5, 
                          ease: "easeInOut"
                        }}
                      >
                        {isCopied ? <Check size={18} /> : <Copy size={18} />}
                      </motion.div>
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleViewOnExplorer}
                      className="h-10 w-10 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white border-slate-600 hover:border-slate-500 hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                      title="View on Solana Explorer"
                    >
                      <ExternalLink size={18} />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Success message */}
          {isCopied && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-full">
                <Check size={16} className="text-green-400" />
                <span className="text-sm text-green-400 font-medium">Successfully copied to clipboard!</span>
              </div>
            </motion.div>
          )}
          
          {/* Decorative elements */}
          <div className="absolute top-2 right-2 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-xl" />
          <div className="absolute bottom-2 left-2 w-16 h-16 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 rounded-full blur-xl" />
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ContractAddress;