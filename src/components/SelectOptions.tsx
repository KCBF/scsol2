import React from 'react';
import { motion } from 'framer-motion';

interface SelectOptionsProps {
  language: string;
  position: { x: number; y: number };
  onClose: () => void;
  onTopicClick: () => void;
  onBuddyClick: () => void;
}

const SelectOptions: React.FC<SelectOptionsProps> = ({ 
  language, 
  position, 
  onClose,
  onTopicClick,
  onBuddyClick
}) => {
  // Calculate position - ensure it stays within viewport
  const posX = Math.min(position.x, window.innerWidth - 200); // Prevent overflow right
  const posY = Math.min(position.y, window.innerHeight - 120); // Prevent overflow bottom

  return (
    <motion.div
      className="absolute z-50 bg-white rounded-lg shadow-xl p-4 w-48"
      style={{ 
        left: posX, 
        bottom: posY
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <div className="text-center mb-2">
        <h3 className="font-semibold text-lg text-purple-800">{language}</h3>
        <p className="text-sm text-gray-600">Choose an option</p>
      </div>

      <div className="space-y-2">
        <button 
          onClick={onTopicClick}
          className="w-full p-2 text-left rounded-md hover:bg-purple-50 transition-colors"
        >
          <span className="font-medium">Learn by Topics</span>
          <p className="text-xs text-gray-500">Organized vocabulary</p>
        </button>
        
        <button 
          onClick={onBuddyClick}
          className="w-full p-2 text-left rounded-md hover:bg-purple-50 transition-colors"
        >
          <span className="font-medium">Cake Buddy</span>
          <p className="text-xs text-gray-500">Learn with AI assistant</p>
        </button>
      </div>

      <button 
        onClick={onClose} 
        className="absolute -top-2 -right-2 bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-gray-200"
      >
        ×
      </button>
    </motion.div>
  );
};

export default SelectOptions;
