const LoadingSpinner = ({ size = 'medium' }) => {
  const sizes = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizes[size]} border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin`}
      ></div>
    </div>
  );
};

export default LoadingSpinner;