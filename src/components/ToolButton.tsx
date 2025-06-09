import React from 'react';

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const ToolButton: React.FC<ToolButtonProps> = ({ icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center p-1 sm:p-2 rounded-lg border-2 transition-all ${
        active
          ? 'border-blue-500 bg-blue-50 text-blue-700'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      {icon}
      <span className="text-[8px] sm:text-[10px] mt-0.5 font-medium leading-tight">{label}</span>
    </button>
  );
};

export default ToolButton;