import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import {signInStart,signInFailure,signInSuccess} from '../app/user/userSlice';
const Login = () => {
  const dispatch=useDispatch();
  const {loading,error:loginError} =useSelector((state)=>state.user)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });
  //const [loading, setLoading] = useState(false);
  //const [loginError, setLoginError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Reset errors when user starts typing
    setErrors({
      ...errors,
      [name]: ''
    });
  };
  const Navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate form fields
    let valid = true;
    const newErrors = {};

    for (const key in formData) {
      if (!formData[key].trim()) {
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
        valid = false;
      }
    }

    setErrors(newErrors);

    if (valid) {
      //setLoading(true);
      dispatch(signInStart())
      // Add your login logic here, such as sending the form data to the server
      const res = await fetch('/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      ///setLoading(false);
      if (!data.success) {
        //setLoginError(data.errors); // Set login error message received from the server
        dispatch(signInFailure(data.errors))
      } else {
        dispatch(signInSuccess(data.data))
        setFormData({
          email: '',
          password: ''
        });
        // Redirect to home page upon successful login
        if(data.data.user.role==="buyer")
        Navigate("/");
      else 
      Navigate("/seller");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Login</h2>
        <form className="grid gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email && 'border-red-500'}`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password && 'border-red-500'}`}
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div className="flex items-center justify-self-end">
            <div className="justify-self-end">
              <button
                disabled={loading}
                onClick={handleLogin}
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {loading ? 'Loading...' : 'Login'}
              </button>
            </div>
          </div>
          {loginError && (
            <div className="mt-4 text-red-500">
              {loginError}
            </div>
          )}
          <div className="mt-4">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/sign-up" className="text-blue-500 hover:text-blue-700">
                Sign Up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
