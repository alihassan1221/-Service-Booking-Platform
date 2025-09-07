import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Calendar, Plus, Clock } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const UserDashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { bookings } = useSelector((state) => state.bookings);

  useEffect(() => {
    if (bookings) {
      const totalBookings = bookings.length;
      const pending = bookings.filter(b => b.status === 'pending').length;
      const completed = bookings.filter(b => b.status === 'completed').length;
      
      setStats({
        total: totalBookings,
        pending,
        completed
      });
      setIsLoading(false);
    }
  }, [bookings]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <Link to="/create-booking">
          <Button>
            <Plus className="w-5 h-5 mr-2" />
            New Booking
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                {stats?.total || 0}
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
                Pending
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
              <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completed
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats?.completed || 0}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Recent Bookings
        </h2>
        {bookings && bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.slice(0, 3).map((booking) => (
              <div key={booking._id} className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white capitalize">
                    {booking.vehicleType} Service
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(booking.preferredDate).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                  booking.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                  booking.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                  'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                }`}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400">
              You don't have any bookings yet. Create your first booking to get started!
            </p>
            <Link to="/create-booking">
              <Button>Create Booking</Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
};

export default UserDashboard;