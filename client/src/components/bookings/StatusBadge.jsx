const StatusBadge = ({ status, className = '' }) => {
  const statusConfig = {
    pending: {
      color: 'yellow',
      text: 'Pending',
      icon: '⏳'
    },
    approved: {
      color: 'green',
      text: 'Approved',
      icon: '✅'
    },
    rejected: {
      color: 'red',
      text: 'Rejected',
      icon: '❌'
    },
    completed: {
      color: 'blue',
      text: 'Completed',
      icon: '🎉'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
      bg-${config.color}-100 text-${config.color}-800 
      dark:bg-${config.color}-900/30 dark:text-${config.color}-300 
      border border-${config.color}-200 dark:border-${config.color}-700
      ${className}`}>
      <span className="mr-1.5">{config.icon}</span>
      {config.text}
    </span>
  );
};

export default StatusBadge;