/* eslint-disable no-unused-vars */
const StatsCard = ({ title, value, icon: Icon, color = 'blue' }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
  };

  return (
    <div className="card">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;