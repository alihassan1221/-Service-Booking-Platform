import BookingList from '../../components/bookings/BookingList';

const AllBookings = () => {

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Booking Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and monitor all booking requests
          </p>
        </div>
      </div>

      {/* Booking List */}
      <BookingList isManagerView={true} />
    </div>
  );
};

export default AllBookings;