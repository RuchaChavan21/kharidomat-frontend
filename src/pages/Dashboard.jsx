import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import BookingsTable from '../components/BookingsTable';
import ItemCardList from '../components/ItemCardList';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { token, user } = useAuth();
  const [userBookings, setUserBookings] = useState([]);
  const [userItems, setUserItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch both user bookings and user items in parallel
        const [bookingsData, itemsData] = await Promise.all([
          fetchUserBookings(),
          fetchUserItems()
        ]);
        
        setUserBookings(bookingsData);
        setUserItems(itemsData);
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again.');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const fetchUserBookings = async () => {
    // For demo purposes, using mock data
    // In production, replace with actual API call:
    // const response = await fetch('http://localhost:8080/api/bookings/my', {
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json',
    //   },
    // });
    // return await response.json();
    
    // Mock bookings data
    return [
      {
        id: 'BK001',
        itemName: 'Calculus Textbook',
        itemImage: 'https://via.placeholder.com/150x100?text=Calculus',
        startDate: '2024-01-15',
        endDate: '2024-05-15',
        status: 'Active',
        price: 50,
        owner: 'John Doe',
        totalAmount: 6000
      },
      {
        id: 'BK002',
        itemName: 'Scientific Calculator',
        itemImage: 'https://via.placeholder.com/150x100?text=Calculator',
        startDate: '2024-01-20',
        endDate: '2024-02-20',
        status: 'Completed',
        price: 25,
        owner: 'Jane Smith',
        totalAmount: 775
      },
      {
        id: 'BK003',
        itemName: 'Tennis Racket',
        itemImage: 'https://via.placeholder.com/150x100?text=Tennis',
        startDate: '2024-02-01',
        endDate: '2024-02-15',
        status: 'Upcoming',
        price: 30,
        owner: 'Mike Johnson',
        totalAmount: 420
      }
    ];
  };

  const fetchUserItems = async () => {
    // For demo purposes, using mock data
    // In production, replace with actual API call:
    // const response = await fetch('http://localhost:8080/api/items/my', {
    //   headers: {
    //     'Authorization': `Bearer ${token}`,
    //     'Content-Type': 'application/json',
    //   },
    // });
    // return await response.json();
    
    // Mock items data
    return [
      {
        id: 'ITM001',
        title: 'MacBook Pro 2023',
        description: 'Excellent condition MacBook Pro for programming and design work',
        imageUrl: 'https://via.placeholder.com/300x200?text=MacBook',
        pricePerDay: 200,
        category: 'Electronics',
        status: 'Available',
        totalBookings: 5,
        totalEarnings: 8000
      },
      {
        id: 'ITM002',
        title: 'Bicycle - Mountain Bike',
        description: 'Perfect for campus commuting and weekend adventures',
        imageUrl: 'https://via.placeholder.com/300x200?text=Bicycle',
        pricePerDay: 80,
        category: 'Sports',
        status: 'Rented',
        totalBookings: 3,
        totalEarnings: 2400
      },
      {
        id: 'ITM003',
        title: 'DSLR Camera Kit',
        description: 'Professional photography kit with multiple lenses',
        imageUrl: 'https://via.placeholder.com/300x200?text=Camera',
        pricePerDay: 150,
        category: 'Electronics',
        status: 'Available',
        totalBookings: 2,
        totalEarnings: 900
      }
    ];
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      // In production, make API call to cancel booking
      // await fetch(`http://localhost:8080/api/bookings/${bookingId}/cancel`, {
      //   method: 'PUT',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      
      // For demo, just remove from state
      setUserBookings(prev => prev.filter(booking => booking.id !== bookingId));
      alert('Booking cancelled successfully!');
    } catch (error) {
      alert('Failed to cancel booking. Please try again.');
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      // In production, make API call to delete item
      // await fetch(`http://localhost:8080/api/items/${itemId}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${token}`,
      //     'Content-Type': 'application/json',
      //   },
      // });
      
      // For demo, just remove from state
      setUserItems(prev => prev.filter(item => item.id !== itemId));
      alert('Item deleted successfully!');
    } catch (error) {
      alert('Failed to delete item. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      {/* Header Section */}
      <section className="bg-white shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 mb-4">
              My Dashboard
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Manage your rentals and listings in one place
            </p>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
            >
              <p className="text-red-600 font-medium">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 btn-primary"
              >
                Try Again
              </button>
            </motion.div>
          ) : (
            <div className="space-y-10">
              {/* Stats Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-6"
              >
                {[
                  { title: 'Total Rentals', value: userBookings.length, icon: '📋', color: 'bg-purple-500' },
                  { title: 'Active Rentals', value: userBookings.filter(b => b.status === 'Active').length, icon: '✅', color: 'bg-green-500' },
                  { title: 'My Listings', value: userItems.length, icon: '🏠', color: 'bg-blue-500' },
                  { title: 'Total Earnings', value: `₹${userItems.reduce((sum, item) => sum + item.totalEarnings, 0)}`, icon: '💰', color: 'bg-yellow-500' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="card p-6"
                  >
                    <div className="flex items-center">
                      <div className={`${stat.color} text-white p-3 rounded-xl mr-4`}>
                        <span className="text-2xl">{stat.icon}</span>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-gray-600">{stat.title}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* My Rentals Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display font-bold text-gray-900">My Rentals</h2>
                  <a href="/items" className="btn-primary text-sm">
                    Browse More Items
                  </a>
                </div>
                <BookingsTable 
                  bookings={userBookings} 
                  onCancelBooking={handleCancelBooking}
                />
              </motion.section>

              {/* My Listings Section */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display font-bold text-gray-900">My Listings</h2>
                  <Link to="/items/add" className="btn-primary text-sm">
                    Add New Item
                  </Link>
                </div>
                <ItemCardList 
                  items={userItems} 
                  onDeleteItem={handleDeleteItem}
                />
              </motion.section>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
