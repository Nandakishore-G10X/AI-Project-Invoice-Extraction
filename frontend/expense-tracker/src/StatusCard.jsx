// StatusCard.jsx
import React from 'react';
import { Info, AlertCircle, CheckCircle } from 'lucide-react';

const iconMap = {
  info: <Info className="w-5 h-5 text-blue-500" />,
  warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
};

const bgColorMap = {
  info: 'bg-blue-50 text-blue-800',
  warning: 'bg-yellow-50 text-yellow-800',
  success: 'bg-green-50 text-green-800',
};

const StatusCard = ({ type = 'info', children }) => {
  return (
    <div className={`rounded-lg p-4 text-sm flex items-start gap-3 ${bgColorMap[type]}`}>
      <div className="mt-1">{iconMap[type]}</div>
      <div>{children}</div>
    </div>
  );
};

export default StatusCard;
