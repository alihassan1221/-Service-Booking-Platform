/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { 
  Filter, 
  Calendar, 
  BarChart3,
  Users,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import BookingList from '../../components/bookings/BookingList';
import Card from '../../components/common/Card';

const AllBookings = () => {
  const [activeTab, setActiveTab] = useState('all');

  // Mock stats data - replace with real data from your API
  const stats = {
    total: 1247,
    pending: 28,
    approved: 984,
    rejected: 35,
    completed: 200
  };

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