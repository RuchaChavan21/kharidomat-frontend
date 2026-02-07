import axios from 'axios';
import { mockItems, mockBookings, mockMyListings } from './mockData';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optionally add auth token if needed later
API.interceptors.request.use((config) => {
  const publicEndpoints = [
    '/users/register',
    '/users/login',
    '/users/verify',
    '/users/forgot-password',
    '/users/reset-password'
  ];

  const isPublic = publicEndpoints.some(endpoint => config.url.includes(endpoint));

  if (!isPublic) {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// --- MOCK API INTERCEPTOR FOR PROTOTYPE ---
const USE_MOCK = true;

if (USE_MOCK) {
  const originalGet = API.get;
  const originalPost = API.post;
  const originalPut = API.put;
  const originalDelete = API.delete;

  API.get = async (url, config) => {
    console.log(`[MOCK API] GET ${url}`);
    await new Promise(r => setTimeout(r, 600)); // Simulate network delay

    // Parse URL params for filtering
    const urlObj = new URL(url, 'http://localhost:8080'); // Dummy base for parsing
    const category = urlObj.searchParams.get('category');
    const title = urlObj.searchParams.get('title');

    if (url.includes('/items/search') || (url.includes('/items') && !url.includes('/my') && !url.match(/\/items\/\d+/))) {
      let filteredItems = [...mockItems];

      // Filter by Category
      if (category && category !== 'All') {
        filteredItems = filteredItems.filter(item =>
          item.category.toLowerCase() === category.toLowerCase()
        );
      }

      // Filter by Search Title
      if (title) {
        filteredItems = filteredItems.filter(item =>
          item.title.toLowerCase().includes(title.toLowerCase())
        );
      }

      return { data: filteredItems, status: 200 };
    }
    const itemMatch = url.match(/\/items\/(\d+)/);
    if (itemMatch) {
      const id = parseInt(itemMatch[1]);
      const item = mockItems.find(i => i.id === id) || mockItems[0];
      return { data: item, status: 200 };
    }
    if (url.includes('/bookings/my')) {
      return { data: mockBookings, status: 200 };
    }
    if (url.includes('/items/my')) {
      return { data: mockMyListings, status: 200 };
    }
    if (url.includes('/bookings/status-grouped')) {
      return { data: { ACTIVE: 1, UPCOMING: 1, COMPLETED: 1, CANCELLED: 0 }, status: 200 };
    }
    if (url.includes('/users/wishlist')) {
      return { data: [], status: 200 };
    }
    if (url.includes('/dashboard/stats')) {
      return {
        data: {
          totalBookingsMade: 12,
          totalListingsOwned: 5,
          totalAmountSpent: 4500,
          totalAmountEarned: 1200,
          totalWishlistItems: 3
        },
        status: 200
      };
    }

    // Fallback to original for unmocked get, but catch error since backend is likely down
    // STATIC MODE: Do not fallback to backend
    console.warn(`[MOCK API] No mock found for ${url}, returning empty array.`);
    return { data: [], status: 200 };
    /*
    try {
      return await originalGet(url, config);
    } catch (e) {
      console.warn(`[MOCK API] Failed real GET request to ${url}, returning empty/null`, e);
      return { data: [], status: 200 };
    }
    */
  };

  API.post = async (url, data, config) => {
    console.log(`[MOCK API] POST ${url}`, data);
    await new Promise(r => setTimeout(r, 600));

    if (url.includes('/users/login')) {
      return { data: "mock-jwt-token-12345", status: 200 };
    }
    if (url.includes('/users/register')) {
      return { data: "User registered successfully", status: 200 };
    }
    if (url.includes('/payment/create-order')) {
      return {
        data: {
          orderId: "order_mock_" + Date.now(),
          amount: (data.amount || 5000) * 100,
          currency: "INR"
        },
        status: 200
      };
    }
    if (url.includes('/payment/verify')) {
      return { data: "Payment Verified", status: 200 };
    }
    if (url.includes('/bookings')) {
      return { data: "Booking Successful", status: 200 };
    }
    // Wishlist
    if (url.includes('/users/wishlist')) {
      return { data: "Wishlist updated", status: 200 };
    }

    return { data: {}, status: 200 };
  };

  API.put = async (url, data, config) => {
    console.log(`[MOCK API] PUT ${url}`, data);
    await new Promise(r => setTimeout(r, 600));
    return { data: "Success", status: 200 };
  }

  API.delete = async (url, config) => {
    console.log(`[MOCK API] DELETE ${url}`);
    await new Promise(r => setTimeout(r, 600));
    return { data: "Deleted", status: 200 };
  }
}

export default API;
