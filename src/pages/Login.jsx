import React from 'react';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-200 to-pink-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-purple-700">Login to CampusRent</h2>

        <form>
          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-800 transition duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
