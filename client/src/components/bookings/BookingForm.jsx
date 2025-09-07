import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { createBooking } from '../../store/slices/bookingSlice';
import Input from '../common/Input';
import Button from '../common/Button';

const BookingForm = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    vehicleType: '',
    issueDescription: '',
    preferredDate: '',
    location: ''
  });

  const vehicleTypes = [
    { value: 'car', label: 'Car' },
    { value: 'motorcycle', label: 'Motorcycle' },
    { value: 'truck', label: 'Truck' },
    { value: 'suv', label: 'SUV' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await dispatch(createBooking(formData)).unwrap();
      toast.success('Booking created successfully!');
      setFormData({
        vehicleType: '',
        issueDescription: '',
        preferredDate: '',
        location: ''
      });
    } catch (error) {
      toast.error(error.message || 'Failed to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Create New Booking
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Vehicle Type</label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="input-field"
                required = {true}
              >
                <option value="">Select Vehicle Type</option>
                {vehicleTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <Input
              label="Preferred Date"
              name="preferredDate"
              type="date"
              value={formData.preferredDate}
              onChange={handleChange}
              required = {true}
            />
          </div>

          <Input
            label="Location"
            name="location"
            type="text"
            placeholder="Enter service location"
            value={formData.location}
            onChange={handleChange}
            required = {true}
          />

          <div>
            <label className="label">Issue Description</label>
            <textarea
              name="issueDescription"
              rows={4}
              placeholder="Describe the issue with your vehicle..."
              value={formData.issueDescription}
              onChange={handleChange}
              className="input-field"
              required = {true}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Creating Booking...' : 'Create Booking'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;