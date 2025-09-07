import { useSelector } from 'react-redux';
import { 
  Mail, 
  User, 
  Calendar, 
  Shield,
  Edit3,
  Download,
  Settings,
  Bell
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  console.log('User Data is =>', user)

  const getRoleConfig = (role) => {
    switch (role) {
      case 'admin':
        return {
          color: 'bg-gradient-to-r from-purple-500 to-pink-500',
          badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-200 dark:border-purple-700',
          icon: <Shield className="w-4 h-4" />,
          title: 'Administrator'
        };
      case 'manager':
        return {
          color: 'bg-gradient-to-r from-blue-500 to-cyan-500',
          badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-700',
          icon: <Settings className="w-4 h-4" />,
          title: 'Manager'
        };
      default:
        return {
          color: 'bg-gradient-to-r from-gray-500 to-gray-600',
          badge: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border border-gray-200 dark:border-gray-700',
          icon: <User className="w-4 h-4" />,
          title: 'User'
        };
    }
  };

  const roleConfig = getRoleConfig(user?.role);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account information and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card className="p-6 text-center">
            <div className="relative">
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-4xl font-bold mb-6 relative">
                {user?.name?.charAt(0).toUpperCase()}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${roleConfig.badge}`}>
                    {roleConfig.icon}
                    <span className="ml-1.5">{user?.role}</span>
                  </span>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {user?.name}
            </h2>
            
            <div className="flex items-center justify-center text-gray-600 dark:text-gray-400 mb-6">
              <Mail className="w-4 h-4 mr-2" />
              <span>{user?.email}</span>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg mb-6">
              <div className="flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-2" />
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  {roleConfig.title} account
                </p>
              </div>
            </div>

            {/* <div className="space-y-2">
              <Button variant="outline" className="w-full justify-center">
                <Bell className="w-4 h-4 mr-2" />
                Notification Settings
              </Button>
              <Button variant="outline" className="w-full justify-center">
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </Button>
            </div> */}
          </Card>
        </div>

        {/* Details Card */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Account Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Personal Information */}
              <div className="">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                    Personal Details
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 mr-3">
                        <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 mr-3">
                        <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                        <p className="font-medium text-gray-900 dark:text-white">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                    Account Details
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 mr-3">
                        <Shield className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Account Type</p>
                        <p className="font-medium text-gray-900 dark:text-white capitalize">{user?.role}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 mr-3">
                        <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Member Since</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          }) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="pt-3 mt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                Additional Information
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">User ID</p>
                  <p className="text-sm font-mono text-gray-900 dark:text-white truncate">
                    {user?.id || 'N/A'}
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Last Login</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>  
      </div>
    </div>
  );
};

export default Profile;