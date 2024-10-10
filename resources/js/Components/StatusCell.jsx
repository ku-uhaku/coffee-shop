import React from 'react';

const StatusCell = ({ 
  value, 
  onStatusChange, 
  statusConfig = {
    active: { bgColor: 'bg-green-100', textColor: 'text-green-900' },
    inactive: { bgColor: 'bg-red-100', textColor: 'text-red-900' }
  },
  defaultConfig = { bgColor: 'bg-gray-100', textColor: 'text-gray-900' }
}) => {
  const config = statusConfig[value] || defaultConfig;

  return (
    <span 
      className={`px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full cursor-pointer ${
        config.bgColor
      } ${
        config.textColor
      }`}
      onClick={onStatusChange}
    >
      {typeof value === 'string' ? value.charAt(0).toUpperCase() + value.slice(1) : value}
    </span>
  );
};

export default StatusCell;