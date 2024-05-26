import React from 'react';

const SellerDetail = ({ property, onClose, userData }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="bg-black opacity-50 absolute inset-0"></div>
    <div className="bg-white p-8 rounded-lg shadow-lg relative z-10 w-96 flex flex-col">
      <h2 className="text-2xl font-bold mb-4">Seller Details</h2>
      <div className="mb-4">
        <p className="text-gray-700 text-sm font-bold mb-2">
          First Name: <span className="text-gray-700">{userData.firstName}</span>
        </p>
        <p className="text-gray-700 text-sm font-bold mb-2">
          Last Name: <span className="text-gray-700">{userData.lastName}</span>
        </p>
        <p className="text-gray-700 text-sm font-bold mb-2">
          Email: <span className="text-gray-700">{userData.email}</span>
        </p>
        <p className="text-gray-700 text-sm font-bold mb-2">
          Phone Number: <span className="text-gray-700">{userData.phoneNumber}</span>
        </p>
      </div>
      <div className="flex items-center justify-between mt-4">
        <p className="text-gray-700 text-sm">Seller details will be shared via email too.</p>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={()=>onClose()}
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);
};
export default SellerDetail;
