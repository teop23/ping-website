import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { fetchSpacesStatus, type SpacesStatus } from '../utils/spacesApi';

const SpacesToast: React.FC = () => {
  const [spacesData, setSpacesData] = useState<SpacesStatus | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Poll the API every 30 seconds
  useEffect(() => {
    const checkSpacesStatus = async () => {
      console.log('here');
      //const data = await fetchSpacesStatus();
      setIsVisible(true);
      setSpacesData({
        live: true,
        name: '$PING Daily Space #16',
        link: 'https://x.com/i/spaces/1nAKEgAYrEbJL',
      });
      return;
      if (data) {
        setSpacesData(data);
        // Show toast if spaces are live and not manually dismissed
        if (data.live && !isDismissed) {
          setIsVisible(true);
        } else if (!data.live) {
          setIsVisible(false);
          setIsDismissed(false); // Reset dismissal when spaces end
        }
      }
    };

    // Check immediately
    checkSpacesStatus();

    // Set up polling interval
    const interval = setInterval(checkSpacesStatus, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  const handleOpenSpaces = () => {
    if (spacesData?.link) {
      window.open(spacesData.link, '_blank', 'noopener,noreferrer');
    }
  };

  if (!spacesData?.live || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-50"
          style={{ width: '280px' }}
        >
          <div className="bg-black text-white  p-2 rounded-xl shadow-2xl border border-gray-800 overflow-hidden backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                {/* Pulsating REC indicator */}
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-3 h-3 bg-red-500 rounded-full"
                  />
                  <span className="text-red-500 font-semibold text-sm">LIVE</span>
                </div>
              </div>

              <button
                onClick={handleDismiss}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-800"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="px-1">
              <div className="mb-2">
                <h3 className="font-bold text-white text-sm mb-1">
                  Twitter Spaces is live
                </h3>
                <p className="text-gray-300 text-xs">
                  {spacesData.name}
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={handleOpenSpaces}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2.5 px-4 font-semibold text-sm transition-colors duration-200 flex items-center justify-center gap-2"
              >
                Join Space
                <ExternalLink size={14} />
              </button>
            </div>

            {/* Bottom accent line */}
            {/*<div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />*/}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpacesToast;