import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import type { LoginFormData } from '../types';
import toast from 'react-hot-toast';
import { isAxiosError } from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { jwtDecode } from 'jwt-decode';
import type { User } from '../context/AuthContext';

const LoginPage = () => {
  const { register, handleSubmit } = useForm<LoginFormData>();
  const navigate = useNavigate();

  const authContext = useContext(AuthContext);
  if(!authContext) throw new Error('AuthContext must be used within an AuthProvider');
  const {setUser} = authContext;
  const onSubmit = async (data: LoginFormData) => {
    const toastId = toast.loading('Logging in...');
    try {
      const response = await loginUser(data);
      toast.success('Login successful!', { id: toastId });
      
      localStorage.setItem('token', response.token);
      const decodedUser = jwtDecode<User>(response.token);
      setUser(decodedUser);
      navigate('/'); 

    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data.error, { id: toastId });
      } else {
        toast.error('An unexpected error occurred.', { id: toastId });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Sign in to your account</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email address</label>
            <input
              id="email"
              type="email"
              {...register('email', { required: true })}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              {...register('password', { required: true })}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;