const StatusBadge = ({ status }) => {
  const statusConfig = {
    pending: {
      color: 'yellow',
      text: 'Pending'
    },
    approved: {
      color: 'green',
      text: 'Approved'
    },
    rejected: {
      color: 'red',
      text: 'Rejected'
    },
    completed: {
      color: 'blue',
      text: 'Completed'
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800 dark:bg-${config.color}-900/20 dark:text-${config.color}-400`}>
      {config.text}
    </span>
  );
};

export default StatusBadge;