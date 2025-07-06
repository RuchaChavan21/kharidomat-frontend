import React from 'react';

const NotFound = () => {
  return (
    <div className="h-screen flex justify-center items-center text-center bg-red-50">
      <div>
        <h1 className="text-6xl text-red-500 font-bold">404</h1>
        <p className="text-xl mt-2 text-gray-600">Page not found</p>
      </div>
    </div>
  );
};

export default NotFound;
