import React from 'react';
import { RepairJob } from '../types/repairJob';

interface StatusIndicatorProps {
  status: RepairJob['status'];
}

const getStatusStyles = (status: RepairJob['status']) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 ring-yellow-500';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800 ring-blue-500';
    case 'completed':
      return 'bg-green-100 text-green-800 ring-green-500';
    case 'delivered':
      return 'bg-purple-100 text-purple-800 ring-purple-500';
    default:
      return 'bg-gray-100 text-gray-800 ring-gray-500';
  }
};

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status }) => {
  const styles = getStatusStyles(status);
  
  // Capitalize first letter
  const statusText = status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');

  return (
    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium 
                     ring-1 ring-inset ${styles}`}>
      {statusText}
    </span>
  );
};

export default StatusIndicator;

// Example Usage: <StatusIndicator status={job.status} />
