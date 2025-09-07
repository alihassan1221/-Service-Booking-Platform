import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUsers } from '../../store/slices/userSlice';
import UserCard from './UserCard';
import LoadingSpinner from '../common/LoadingSpinner';

const UserList = () => {
  const dispatch = useDispatch();
  const { users, isLoading, isError, message } = useSelector((state) => state.users);

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="large" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading users...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">Error: {message}</p>
        <button
          onClick={() => dispatch(getUsers())}
          className="mt-4 btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No users found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {users.map((user) => (
        <UserCard key={user._id} user={user} />
      ))}
    </div>
  );
};

export default UserList;