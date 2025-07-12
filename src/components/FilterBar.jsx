import React from 'react';

const FilterBar = ({ selectedCategory, onSelectCategory }) => {
  const categories = [
    { name: 'All', icon: '🏠' },
    { name: 'Electronics', icon: '💻' },
    { name: 'Stationery', icon: '✏️' },
    { name: 'Music', icon: '🎵' },
    { name: 'Sports', icon: '⚽' },
    { name: 'Books', icon: '📚' },
  ];

  const getCategoryColor = (categoryName) => {
    const colors = {
      'All': 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      'Electronics': 'bg-accent-100 text-accent-700 hover:bg-accent-200',
      'Stationery': 'bg-mint-100 text-mint-700 hover:bg-mint-200',
      'Music': 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      'Sports': 'bg-orange-100 text-orange-700 hover:bg-orange-200',
      'Books': 'bg-purple-100 text-purple-700 hover:bg-purple-200',
    };
    return colors[categoryName] || colors['All'];
  };

  const getActiveColor = (categoryName) => {
    const colors = {
      'All': 'bg-gray-800 text-white',
      'Electronics': 'bg-accent-600 text-white',
      'Stationery': 'bg-mint-600 text-white',
      'Music': 'bg-purple-600 text-white',
      'Sports': 'bg-orange-600 text-white',
      'Books': 'bg-purple-600 text-white',
    };
    return colors[categoryName] || colors['All'];
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => onSelectCategory(category.name)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
              selectedCategory === category.name
                ? getActiveColor(category.name)
                : getCategoryColor(category.name)
            }`}
          >
            <span className="text-lg">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
