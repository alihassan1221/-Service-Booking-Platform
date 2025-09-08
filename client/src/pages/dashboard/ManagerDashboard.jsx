import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar, Users, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getAllBookings } from '../../store/slices/bookingSlice';
import { getUsers } from '../../store/slices/userSlice';

const ManagerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const dispatch = useDispatch();
  const { bookings } = useSelector((state) => state.bookings);
  const { users } = useSelector((state) => state.users);

  const fetchDashboardData = async () => {
    try {
      setIsRefreshing(true);
      await Promise.all([
        dispatch(getAllBookings()).unwrap(),
        dispatch(getUsers()).unwrap()
      ]);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };
  useEffect(()=>{
    fetchDashboardData();
  },[])

  useEffect(() => {
    // Process stats when data is available
    if (bookings && users) {
      const totalBookings = bookings.length;
      const pending = bookings.filter(b => b.status === 'pending').length;
      const totalUsers = users.filter(u => u.role === 'user').length;
      const issues = 0;

      setStats({
        totalBookings,
        pending,
        totalUsers,
        issues
      });
      setIsLoading(false);
    }
  }, [bookings, users]);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="large" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Manager Dashboard
        </h1>
        <div className="flex gap-3">
          <Button 
            onClick={handleRefresh}
            variant="outline"
            disabled={isRefreshing}
            className="flex items-center"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Bookings
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.totalBookings || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Pending Approval
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.pending || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Users
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.totalUsers || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Issues
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.issues || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Bookings
          </h3>
          {bookings && bookings.length > 0 ? (
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking._id} className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm capitalize">
                      {booking.vehicleType}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {booking.user?.name || 'Unknown User'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                    booking.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                    'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {(booking.status).toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-sm p-4">
              No bookings found.
            </p>
          )}
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link to="/manager/bookings">
              <Button variant="outline" className="w-full">
                Manage Bookings
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;