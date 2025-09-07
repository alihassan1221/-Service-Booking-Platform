import BookingList from '../../components/bookings/BookingList';

const MyBookings = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Bookings
        </h1>
      </div>
      <BookingList />
    </div>
  );
};

export default MyBookings;