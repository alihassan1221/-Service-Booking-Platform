// BookingForm.js
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { createBooking } from '../../store/slices/bookingSlice';
import Input from '../common/Input';
import Button from '../common/Button';
import Card from '../common/Card';
import { Car, Calendar, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

const BookingForm = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formData, setFormData] = useState({
    vehicleType: '',
    issueDescription: '',
    preferredDate: '',
    location: ''
  });

  const vehicleTypes = [
    { value: 'car', label: 'Car', icon: '🚗' },
    { value: 'motorcycle', label: 'Motorcycle', icon: '🏍️' },
    { value: 'truck', label: 'Truck', icon: '🚚' },
    { value: 'suv', label: 'SUV', icon: '🚙' },
    { value: 'van', label: 'Van', icon: '🚐' },
    { value: 'bus', label: 'Bus', icon: '🚌' }
  ];

  // Validate form function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.vehicleType.trim()) {
      newErrors.vehicleType = 'Vehicle type is required';
    }

    if (!formData.issueDescription.trim()) {
      newErrors.issueDescription = 'Issue description is required';
    } else if (formData.issueDescription.trim().length < 10) {
      newErrors.issueDescription = 'Description must be at least 10 characters';
    }

    if (!formData.preferredDate) {
      newErrors.preferredDate = 'Preferred date is required';
    } else {
      const selectedDate = new Date(formData.preferredDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.preferredDate = 'Date cannot be in the past';
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    } else if (formData.location.trim().length < 3) {
      newErrors.location = 'Location must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Revalidate only touched fields
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validateForm();
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true
    }));
    validateForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({
      vehicleType: true,
      issueDescription: true,
      preferredDate: true,
      location: true
    });

    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    setIsLoading(true);

    try {
      await dispatch(createBooking(formData)).unwrap();
      toast.success('Booking created successfully!');

      // Reset form
      setFormData({
        vehicleType: '',
        issueDescription: '',
        preferredDate: '',
        location: ''
      });
      setTouched({});
      setErrors({});
    } catch (error) {
      toast.error(error.message || 'Failed to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.vehicleType.trim() &&
      formData.issueDescription.trim() &&
      formData.preferredDate &&
      formData.location.trim() &&
      Object.keys(errors).length === 0
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vehicle Type */}
          <div>
            <label className="label flex items-center">
              <Car className="w-4 h-4 mr-2 text-blue-600" />
              Vehicle Type <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input-field ${
                errors.vehicleType && touched.vehicleType ? 'border-red-500 focus:ring-red-500' : ''
              }`}
            >
              <option value="">Select Vehicle Type</option>
              {vehicleTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
            {errors.vehicleType && touched.vehicleType && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.vehicleType}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preferred Date */}
            <div>
              <Input
                label="Preferred Date"
                name="preferredDate"
                type="date"
                value={formData.preferredDate}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.preferredDate}
                touched={touched.preferredDate}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Location */}
            <div>
              <Input
                label="Location"
                name="location"
                type="text"
                placeholder="Enter service location"
                value={formData.location}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.location}
                touched={touched.location}
                required
              />
            </div>
          </div>

          {/* Issue Description */}
          <div>
            <label className="label">
              Issue Description <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              name="issueDescription"
              rows={4}
              placeholder="Describe the issue with your vehicle in detail..."
              value={formData.issueDescription}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input-field ${
                errors.issueDescription && touched.issueDescription ? 'border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {errors.issueDescription && touched.issueDescription && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.issueDescription}
              </p>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {formData.issueDescription.length}/500 characters
            </p>
          </div>

          {/* Guidelines */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
                  Booking Guidelines
                </p>
                <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                  <li>• Provide detailed description of the issue</li>
                  <li>• Ensure location is accurate for service dispatch</li>
                  <li>• You'll receive confirmation within 2 business hours</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading || !isFormValid()}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Booking...
              </div>
            ) : (
              'Create Booking'
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default BookingForm;
