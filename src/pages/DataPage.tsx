import React, { useState } from 'react';
import { Search, Filter, Download, Gem, Camera } from 'lucide-react';
import DataTable from '../components/DataTable';
import CategoryFilter from '../components/CategoryFiilter';
import VirtualTryOn from '../components/VirtualTryOn';
import { TableData, JewelryCategory } from '../types';

interface DataPageProps {
  data: TableData[];
}

const DataPage: React.FC<DataPageProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAvailability, setFilterAvailability] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<JewelryCategory>('All Jewellery');
  const [showVirtualTryOn, setShowVirtualTryOn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<TableData | null>(null);

  // Categorize products based on description
  const categorizeProduct = (description: string): JewelryCategory => {
    const desc = description.toLowerCase();
    if (desc.includes('gold')) return 'Gold';
    if (desc.includes('diamond')) return 'Diamond';
    if (desc.includes('silver')) return 'Silver';
    if (desc.includes('platinum')) return 'Platinum';
    return 'All Jewellery';
  };

  // Filter data by category, search, and availability
  const filteredData = data.filter(item => {
    const matchesSearch = item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.price.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterAvailability === '' || item.availability === filterAvailability;
    const matchesCategory = selectedCategory === 'All Jewellery' || 
                           categorizeProduct(item.description) === selectedCategory ||
                           item.description.toLowerCase().includes(selectedCategory.toLowerCase());
    return matchesSearch && matchesFilter && matchesCategory;
  });

  // Calculate category counts
  const categoryCounts: Record<JewelryCategory, number> = {
    'All Jewellery': data.length,
    'Gold': data.filter(item => categorizeProduct(item.description) === 'Gold' || item.description.toLowerCase().includes('gold')).length,
    'Diamond': data.filter(item => categorizeProduct(item.description) === 'Diamond' || item.description.toLowerCase().includes('diamond')).length,
    'Silver': data.filter(item => categorizeProduct(item.description) === 'Silver' || item.description.toLowerCase().includes('silver')).length,
    'Platinum': data.filter(item => categorizeProduct(item.description) === 'Platinum' || item.description.toLowerCase().includes('platinum')).length
  };

  const availabilityOptions = [...new Set(data.map(item => item.availability))];

  const handleVirtualTryOn = (product: TableData) => {
    setSelectedProduct(product);
    setShowVirtualTryOn(true);
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Filter */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categoryCounts={categoryCounts}
        />

      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Gem className="h-8 w-8 text-white mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {selectedCategory === 'All Jewellery' ? 'Jewelry Collection' : `${selectedCategory} Collection`}
                </h1>
                <p className="text-purple-100 mt-1">
                  {filteredData.length} of {data.length} jewelry items
                  {selectedCategory !== 'All Jewellery' && ` in ${selectedCategory}`}
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowVirtualTryOn(true)}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
              >
                <Camera className="h-4 w-4 mr-2" />
                Virtual Try-On
              </button>
              <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jewelry items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="sm:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={filterAvailability}
                  onChange={(e) => setFilterAvailability(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="">All Availability</option>
                  {availabilityOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="p-6">
          {data.length === 0 ? (
            <div className="text-center py-12">
              <Gem className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Jewelry Items</h3>
              <p className="text-gray-600">Import jewellry inventory from the admin page to see your items here.</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="text-center py-12">
              <Gem className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Items Found</h3>
              <p className="text-gray-600">
                No jewelry items match your current filters. Try adjusting your search or category selection.
              </p>
            </div>
          ) : (
            <DataTable data={filteredData} onVirtualTryOn={handleVirtualTryOn} />
          )}
        </div>
      </div>
    </div>

      {/* Virtual Try-On Modal */}
      <VirtualTryOn
        isOpen={showVirtualTryOn}
        onClose={() => setShowVirtualTryOn(false)}
        product={selectedProduct}
      />
    </>
  );
};

export default DataPage;