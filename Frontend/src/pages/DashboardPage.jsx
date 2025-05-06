// src/pages/DashboardPage.jsx
import React from 'react';
import useAuthStore from '../store/authStore';

const DashboardPage = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
        
        {user && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-medium">Profile Information</h2>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Address:</strong> {user.address || 'Not provided'}</p>
              <p><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
            </div>
            
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;