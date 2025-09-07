import BookingList from '../../components/bookings/BookingList';

const AllBookings = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          All Bookings
        </h1>
      </div>
      <BookingList isManagerView={true} />
    </div>
  );
};

export default AllBookings;