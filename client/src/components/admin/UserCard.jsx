import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUser } from '../../store/slices/userSlice';
import Button from '../common/Button';

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${user.name}?`)) {
      setIsLoading(true);
      try {
        await dispatch(deleteUser(user._id)).unwrap();
      } catch (error) {
        console.error('Failed to delete user:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'manager':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const canEdit = currentUser?.role === 'admin';
  const isCurrentUser = currentUser?.id === user._id;

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {user.name}
            {isCurrentUser && (
              <span className="ml-2 text-sm text-gray-500">(You)</span>
            )}
          </h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
            {user.role}
          </span>
        </div>
        {canEdit && user.role !== 'admin' && !isCurrentUser && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Email: {user.email}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Joined: {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default UserCard;