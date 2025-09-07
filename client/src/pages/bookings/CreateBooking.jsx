import BookingForm from '../../components/bookings/BookingForm';

const CreateBooking = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Create New Booking
        </h1>
      </div>
      <BookingForm />
    </div>
  );
};

export default CreateBooking;