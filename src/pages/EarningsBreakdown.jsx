import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const EarningsBreakdown = () => {
  const { token } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        setLoading(true);
        const res = await API.get("/items/my-with-bookings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setItems(res.data);
      } catch (err) {
        setError("Failed to fetch listings");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, [token]);

const calculateEarnings = (bookings, pricePerDay) => {
  let total = 0;
  bookings.forEach((b) => {
    const start = new Date(b.startDate);
    const end = new Date(b.endDate);
    const msPerDay = 1000 * 60 * 60 * 24;
    const days = Math.round((end - start) / msPerDay) + 1;
    total += days * pricePerDay;
  });
  return total;
};


  const totalEarnings = items.reduce(
    (acc, item) => acc + calculateEarnings(item.bookings || [], item.pricePerDay),
    0
  );

  return (
    <div className="min-h-screen bg-white pt-24 pb-12 px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header Bar with Title and Back Button */}
        <div className="flex justify-between items-center mb-8">
          <div className="text-left">
            <h1 className="text-3xl md:text-4xl font-extrabold uppercase text-[#D32F2F] mb-2 tracking-wide">Earnings Breakdown</h1>
            <p className="text-gray-700 text-lg font-medium">See your total earnings from all posted items.</p>
          </div>
          <Link
            to="/dashboard"
            className="px-5 py-2 bg-[#D32F2F] text-white rounded-lg hover:bg-red-700 transition"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-10 text-lg text-gray-600">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-600 font-medium py-6">{error}</div>
        ) : items.length === 0 ? (
          <div className="text-center text-gray-500 font-medium py-6">
            You haven’t posted any listings yet.
            <div className="mt-3">
              <Link
                to="/add-item"
                className="text-[#D32F2F] font-bold underline hover:text-[#a62121]"
              >
                Post a listing to start earning
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-xl border-2 border-[#D32F2F] shadow">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-[#D32F2F] text-white text-sm uppercase">
                    <th className="py-3 px-4 text-left">Item</th>
                    <th className="py-3 px-4 text-left">Times Booked</th>
                    <th className="py-3 px-4 text-left">Price Per Day</th>
                    <th className="py-3 px-4 text-left">Total Earnings</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const earnings = calculateEarnings(item.bookings || [], item.pricePerDay);
                    return (
                      <tr
                        key={item.id}
                        className="border-b hover:bg-red-50 transition duration-150"
                      >
                        <td className="py-3 px-4 font-semibold text-gray-800">
                          {item.title}
                        </td>
                        <td className="py-3 px-4">{item.bookings?.length || 0}</td>
                        <td className="py-3 px-4">₹{item.pricePerDay}</td>
                        <td className="py-3 px-4 font-semibold text-[#D32F2F]">
                          ₹{earnings}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-100 font-semibold text-[#D32F2F]">
                    <td className="py-3 px-4 text-left" colSpan={3}>
                      Total Earnings
                    </td>
                    <td className="py-3 px-4">₹{totalEarnings}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="text-center mt-8">
              <Link
                to="/post-item"
                className="inline-block bg-[#D32F2F] hover:bg-[#b71c1c] text-white font-bold py-3 px-6 rounded-lg shadow transition"
              >
                Add More Listings
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default EarningsBreakdown;
