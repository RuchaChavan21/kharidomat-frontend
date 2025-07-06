import React from 'react';

const categories = ['All', 'Books', 'Electronics', 'Music', 'Sports', 'Stationery', 'Fashion', 'Tools', 'Other'];

const FilterBar = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 mb-10 px-4">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelectCategory(cat)}
          className={`px-4 py-2 rounded-full border ${
            selectedCategory === cat
              ? 'bg-purple-700 text-white'
              : 'bg-white text-purple-700'
          } shadow hover:scale-105 transform transition`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
