/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Filter, 
  Search, 
  Calendar, 
  Download,
  ChevronDown,
  ChevronUp,
  Plus
} from 'lucide-react';
import { getUserBookings, getAllBookings } from '../../store/slices/bookingSlice';
import BookingCard from './BookingCard';
import LoadingSpinner from '../common/LoadingSpinner';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';

const BookingList = ({ isManagerView = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookings, isLoading, isError, message } = useSelector((state) => state.bookings);
  const { user } = useSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if(!bookings || bookings.length === 0) {
      dispatch(getUserBookings());
    }
  }, [dispatch, bookings]);

  const handleCreateBooking = () => {
    navigate('/create-booking');
  };

  const handleCreateFirstBooking = () => {
    navigate('/create-booking');
  };

  // Filter bookings based on search and filters
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = searchTerm === '' || 
      booking.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vehicleType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.location?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Sort bookings
  const sortedBookings = [...filteredBookings].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'date':
        return new Date(a.preferredDate) - new Date(b.preferredDate);
      default:
        return 0;
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="large" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading bookings...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <Card className="p-6 text-center">
        <div className="text-red-600 dark:text-red-400 text-lg mb-2">Error Loading Bookings</div>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{message}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isManagerView ? 'All Bookings' : 'My Bookings'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {sortedBookings.length} booking{sortedBookings.length !== 1 ? 's' : ''} found
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {!isManagerView && (
              <Button 
                onClick={handleCreateBooking}
                className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Booking
              </Button>
            )}
          </div>
        </div>

        {/* Search and Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 w-full"
              />
            </div>
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field w-full"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field w-full"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="date">By Service Date</option>
            </select>
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filters
            {showFilters ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
          </button>
        </div>
      </Card>

      {/* Bookings Grid */}
      {sortedBookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedBookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              showActions={isManagerView}
            />
          ))}
        </div>
      ) : (
        <Card className="text-center py-16">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Bookings Found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search criteria' 
              : isManagerView ? 'No bookings have been made yet.' : 'You have no bookings yet.'}
          </p>
          {!isManagerView && (
            <Button onClick={handleCreateFirstBooking}>
              Create Your First Booking
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};

export default BookingList;