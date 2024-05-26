import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: 'buyer',
    password: ''
  });
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState('');

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
    // Clear signup error when user starts typing
    setSignupError('');
  };
  const Navigate= useNavigate()

  const handleSignUp = async (e) => {
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
      setLoading(true);
      // Add your signup logic here, such as sending the form data to the server
      const res = await fetch('/api/v1/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setLoading(false);
      if (!data.success) {
        setSignupError(data.errors); // Set signup error message received from the server
      } else {
        // Clear form data after successful signup
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          role: 'buyer',
          password: ''
        });
        Navigate("/login")
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-xl w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Sign Up</h2>
        <form className="grid grid-cols-2 gap-6">
          {/* First Column */}
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="FirstName">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.firstName && 'border-red-500'}`}
                placeholder="Enter your First Name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name='email'
                value={formData.email}
                onChange={handleInputChange}
                className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email && 'border-red-500'}`}
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user-type">
                I am a
              </label>
              <select
                id="user-type"
                name='role'
                value={formData.role}
                onChange={handleInputChange}
                className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.role && 'border-red-500'}`}
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </div>
          </div>

          {/* Second Column */}
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="LastName">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name='lastName'
                value={formData.lastName}
                onChange={handleInputChange}
                className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.lastName && 'border-red-500'}`}
                placeholder="Enter your Last Name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                name='phoneNumber'
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phoneNumber && 'border-red-500'}`}
                placeholder="Enter your Phone Number"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                name='password'
                value={formData.password}
                onChange={handleInputChange}
                className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.password && 'border-red-500'}`}
                placeholder="Enter your password"
              />
            </div>
          </div>
          
          <div className="col-span-2 flex items-center justify-self-end">
            
            <div className="col-start-2">
              <button
              disabled={loading}
              onClick={handleSignUp}
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {loading ? 'Loading...' : 'Sign Up'}
              </button>
            </div>
          </div>
          <div className="col-span-2 mt-4">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-500 hover:text-blue-700">
                Login
              </Link>
            </p>
          </div>
          {signupError && (
            <div className="col-span-2 mb-4 text-red-500">
              {signupError}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignUp;
