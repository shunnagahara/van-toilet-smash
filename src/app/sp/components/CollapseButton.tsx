import React from 'react';

interface CollapseButtonProps {
  onClick: () => void;
}

const CollapseButton: React.FC<CollapseButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute top-4 left-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 z-10"
    >
      <span className="material-icons">arrow_downward</span>
    </button>
  );
};

export default CollapseButton; 