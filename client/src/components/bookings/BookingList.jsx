import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserBookings, getAllBookings } from '../../store/slices/bookingSlice';
import BookingCard from './BookingCard';
import LoadingSpinner from '../common/LoadingSpinner';

const BookingList = ({ isManagerView = false }) => {
  const dispatch = useDispatch();
  const { bookings, isLoading, isError, message } = useSelector((state) => state.bookings);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isManagerView && user?.role === 'manager') {
      dispatch(getAllBookings());
    } else {
      dispatch(getUserBookings());
    }
  }, [dispatch, isManagerView, user?.role]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">Error: {message}</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          {isManagerView ? 'No bookings found.' : 'You have no bookings yet.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.map((booking) => (
        <BookingCard
          key={booking._id}
          booking={booking}
          showActions={isManagerView}
        />
      ))}
    </div>
  );
};

export default BookingList;