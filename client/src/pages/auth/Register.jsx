import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { register, reset } from '../../store/slices/authSlice';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const { name, email, password, confirmPassword } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate('/');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    const userData = {
      name,
      email,
      password,
    };

    dispatch(register(userData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">SB</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <Input
            label="Full name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={onChange}
            required = {true}
          />
          <Input
            label="Email address"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={onChange}
            required = {true}
          />
          <div className="relative">
            <Input
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={onChange}
              required = {true}
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          <Input
            label="Confirm password"
            name="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={onChange}
            required = {true}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              'Creating account...'
            ) : (
              <div className='flex items-center justify-center'>
                <UserPlus className="w-5 h-5 mr-2" />
                Create account
              </div>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Register;