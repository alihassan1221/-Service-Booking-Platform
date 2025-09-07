import BookingForm from '../../components/bookings/BookingForm';

const CreateBooking = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create New Booking
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Schedule your vehicle service appointment
          </p>
        </div>
      </div>
      <BookingForm />
    </div>
  );
};

export default CreateBooking;