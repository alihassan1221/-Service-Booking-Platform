import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { createManager } from '../../store/slices/userSlice';
import Input from '../common/Input';
import Button from '../common/Button';

const ManagerForm = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await dispatch(createManager(formData)).unwrap();
      toast.success('Manager created successfully!');
      setFormData({
        name: '',
        email: '',
        password: ''
      });
    } catch (error) {
      toast.error(error.message || 'Failed to create manager');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Create New Manager
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          name="name"
          type="text"
          placeholder="Enter manager's name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="Enter manager's email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Enter temporary password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Creating Manager...' : 'Create Manager'}
        </Button>
      </form>
    </div>
  );
};

export default ManagerForm;