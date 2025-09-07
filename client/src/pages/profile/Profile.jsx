import { useSelector } from 'react-redux';
import Card from '../../components/common/Card';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile
        </h1>
      </div>

      <Card>
        <div className="max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold mb-4">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {user?.name}
            </h2>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium mt-2 ${getRoleBadgeColor(user?.role)}`}>
              {user?.role}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <p className="text-gray-900 dark:text-white">{user?.email}</p>
            </div>

            <div>
              <label className="label">Account Type</label>
              <p className="text-gray-900 dark:text-white capitalize">{user?.role}</p>
            </div>

            <div>
              <label className="label">Member Since</label>
              <p className="text-gray-900 dark:text-white">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;