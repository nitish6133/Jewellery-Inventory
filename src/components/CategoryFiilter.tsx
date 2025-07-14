import React from 'react';
import { Gem, Crown, Diamond, Coins, Award } from 'lucide-react';
import { JewelryCategory } from '../types';

interface CategoryFilterProps {
  selectedCategory: JewelryCategory;
  onCategoryChange: (category: JewelryCategory) => void;
  categoryCounts: Record<JewelryCategory, number>;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategory, 
  onCategoryChange, 
  categoryCounts 
}) => {
  const categories: { name: JewelryCategory; icon: React.ReactNode; color: string }[] = [
    { name: 'All Jewellery', icon: <Gem className="h-5 w-5" />, color: 'purple' },
    { name: 'Gold', icon: <Crown className="h-5 w-5" />, color: 'yellow' },
    { name: 'Diamond', icon: <Diamond className="h-5 w-5" />, color: 'blue' },
    { name: 'Silver', icon: <Coins className="h-5 w-5" />, color: 'gray' },
    { name: 'Platinum', icon: <Award className="h-5 w-5" />, color: 'slate' }
  ];

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colorMap = {
      purple: isSelected 
        ? 'bg-purple-600 text-white border-purple-600' 
        : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
      yellow: isSelected 
        ? 'bg-yellow-600 text-white border-yellow-600' 
        : 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100',
      blue: isSelected 
        ? 'bg-blue-600 text-white border-blue-600' 
        : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
      gray: isSelected 
        ? 'bg-gray-600 text-white border-gray-600' 
        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100',
      slate: isSelected 
        ? 'bg-slate-600 text-white border-slate-600' 
        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.purple;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Gem className="h-5 w-5 mr-2 text-purple-600" />
        Shop by Category
      </h3>
      
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.name;
          const count = categoryCounts[category.name] || 0;
          
          return (
            <button
              key={category.name}
              onClick={() => onCategoryChange(category.name)}
              className={`flex items-center px-4 py-3 rounded-lg border-2 transition-all duration-200 font-medium ${
                getColorClasses(category.color, isSelected)
              } ${isSelected ? 'shadow-md transform scale-105' : 'hover:shadow-sm'}`}
            >
              {category.icon}
              <span className="ml-2">{category.name}</span>
              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${
                isSelected 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;