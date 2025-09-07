import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Calendar, MapPin, Clock, Trash2 } from 'lucide-react';
import { updateBooking, deleteBooking } from '../../store/slices/bookingSlice';
import Button from '../common/Button';

const BookingCard = ({ booking, showActions = false }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleStatusUpdate = async (newStatus) => {
    setIsLoading(true);
    try {
      await dispatch(updateBooking({
        bookingId: booking._id,
        bookingData: { status: newStatus }
      })).unwrap();
    } catch (error) {
      console.error('Failed to update booking status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      setIsLoading(true);
      try {
        await dispatch(deleteBooking(booking._id)).unwrap();
      } catch (error) {
        console.error('Failed to delete booking:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Check if user can perform actions (manager or admin)
  const canManageBookings = user?.role === 'manager' || user?.role === 'admin';
  const canDelete = user?.role === 'admin' || booking.user?._id === user?.id;

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
            {booking.vehicleType} Service
          </h3>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
            {(booking.status).toUpperCase()}
          </span>
        </div>
        {showActions && canDelete && (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isLoading}
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Calendar className="w-4 h-4 mr-2" />
          {formatDate(booking.preferredDate)}
        </div>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4 mr-2" />
          {booking.location}
        </div>
        
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <Clock className="w-4 h-4 mr-2" />
          Created {new Date(booking.createdAt).toLocaleDateString()}
        </div>

        {booking?.user && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span className="font-medium">User:</span>
            <span className="ml-2">{booking.user.name} ({booking.user.email})</span>
          </div>
        )}
      </div>

      <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
        {booking.issueDescription}
      </p>

      {showActions && canManageBookings && booking.status !== 'completed' && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {booking.status !== 'approved' && (
              <Button
                variant="outline"
                size="sm"
                disabled={isLoading}
                onClick={() => handleStatusUpdate('approved')}
              >
                Approve
              </Button>
            )}
            {booking.status !== 'rejected' && (
              <Button
                variant="outline"
                size="sm"
                disabled={isLoading}
                onClick={() => handleStatusUpdate('rejected')}
              >
                Reject
              </Button>
            )}
            {booking.status !== 'completed' && (
              <Button
                variant="outline"
                size="sm"
                disabled={isLoading}
                onClick={() => handleStatusUpdate('completed')}
              >
                Complete
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCard;