/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Calendar, 
  Plus, 
  Clock, 
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Car,
  TrendingUp
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { getUserBookings } from '../../store/slices/bookingSlice'; // Import the action

const UserDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const { bookings } = useSelector((state) => state.bookings);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        await dispatch(getUserBookings()).unwrap();
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      }
    };

    // Only fetch if we don't have bookings data
    if (!bookings || bookings.length === 0) {
      fetchBookings();
    }
  }, [dispatch]);

  useEffect(() => {
    // Process stats when bookings data is available
    if (bookings) {
      const totalBookings = bookings.length;
      const pending = bookings.filter(b => b.status === 'pending').length;
      const approved = bookings.filter(b => b.status === 'approved').length;
      const completed = bookings.filter(b => b.status === 'completed').length;
      const rejected = bookings.filter(b => b.status === 'rejected').length;
      
      setStats({
        total: totalBookings,
        pending,
        approved,
        completed,
        rejected
      });
      setIsLoading(false);
    }
  }, [bookings]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      case 'rejected':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="large" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            User Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Overview of your booking activity and statistics
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-800/30">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total</p>
              <p className="text-xl font-bold text-blue-800 dark:text-blue-200">{stats?.total || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-800/30">
              <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pending</p>
              <p className="text-xl font-bold text-yellow-800 dark:text-yellow-200">{stats?.pending || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-800/30">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Approved</p>
              <p className="text-xl font-bold text-green-800 dark:text-green-200">{stats?.approved || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-800/30">
              <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Completed</p>
              <p className="text-xl font-bold text-blue-800 dark:text-blue-200">{stats?.completed || 0}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-red-100 dark:bg-red-800/30">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">Rejected</p>
              <p className="text-xl font-bold text-red-800 dark:text-red-200">{stats?.rejected || 0}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions & Recent Bookings */}
      <div className="grid grid-cols-1 gap-6">

        {/* Recent Bookings */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Bookings
            </h3>
            <Link 
              to="/my-bookings" 
              className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {bookings && bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-lg bg-white dark:bg-gray-700">
                      <Car className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white capitalize">
                        {booking.vehicleType} Service
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(booking.preferredDate).toLocaleDateString()} • {booking.location}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      booking.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                      booking.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {getStatusIcon(booking.status)}
                      <span className="ml-1.5 capitalize">{booking.status}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You don't have any bookings yet
              </p>
              <Link to="/create-booking">
                <Button className="flex items-center mx-auto">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Booking
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>

      {/* Additional Stats Section */}
      {stats?.total > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Booking Insights
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round((stats.completed / stats.total) * 100)}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Completion Rate</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <CheckCircle className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round((stats.approved / stats.total) * 100)}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Approval Rate</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Math.round((stats.rejected / stats.total) * 100)}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Rejection Rate</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default UserDashboard;