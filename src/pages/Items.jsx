import { useState } from 'react';
import itemsData from '../data/items';
import ItemCard from '../components/ItemCard';
import FilterBar from '../components/FilterBar';

const Items = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');

  const filteredItems = itemsData
    .filter((item) => {
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortOption === 'priceLowHigh') return a.pricePerDay - b.pricePerDay;
      if (sortOption === 'priceHighLow') return b.pricePerDay - a.pricePerDay;
      if (sortOption === 'titleAsc') return a.title.localeCompare(b.title);
      if (sortOption === 'titleDesc') return b.title.localeCompare(a.title);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-50 py-10">
      <h2 className="text-4xl font-bold text-center text-purple-700 mb-8">Explore Rentals</h2>

      {/* 🔍 Search Bar */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search for books, guitars, cameras..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xl px-4 py-2 border border-purple-300 rounded-full shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
        />
      </div>

      {/* 🔽 Sort Dropdown */}
      <div className="flex justify-center mb-6">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-4 py-2 border border-purple-300 rounded-full shadow-sm focus:ring-2 focus:ring-purple-500 outline-none"
        >
          <option value="default">Sort By</option>
          <option value="priceLowHigh">Price: Low to High</option>
          <option value="priceHighLow">Price: High to Low</option>
          <option value="titleAsc">Title: A-Z</option>
          <option value="titleDesc">Title: Z-A</option>
        </select>
      </div>

      {/* 🎯 Category Filter */}
      <FilterBar selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />

      {/* 🧾 Cards Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
        {filteredItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Items;
