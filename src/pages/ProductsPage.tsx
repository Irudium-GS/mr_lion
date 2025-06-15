import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal } from 'lucide-react';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilters from '../components/products/ProductFilters';

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [minRating, setMinRating] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<string>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Get initial values from URL params
  useEffect(() => {
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'featured';
    
    setSelectedCategory(category);
    setSearchQuery(search);
    setSortOption(sort);
    
    // Reset mobile filter state when URL changes
    setIsMobileFilterOpen(false);
  }, [searchParams]);

  const updateSearchParams = (params: Record<string, string>) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    // Update or remove each parameter
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newSearchParams.set(key, value);
      } else {
        newSearchParams.delete(key);
      }
    });
    
    setSearchParams(newSearchParams);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    updateSearchParams({ category });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
    // For simplicity, we're not adding price to URL params
    // but you could add it like this:
    // updateSearchParams({ minPrice: min.toString(), maxPrice: max.toString() });
  };

  const handleRatingChange = (rating: number) => {
    setMinRating(rating);
    // Similarly, not adding rating to URL params
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sort = e.target.value;
    setSortOption(sort);
    updateSearchParams({ sort });
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setMinPrice(0);
    setMaxPrice(10000);
    setMinRating(0);
    
    // Clear filters from URL but keep search query if any
    const newSearchParams = new URLSearchParams();
    if (searchQuery) {
      newSearchParams.set('search', searchQuery);
    }
    setSearchParams(newSearchParams);
  };

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  return (
    <div className="pt-24 pb-16">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="text-sm breadcrumbs mb-6">
          <ul className="flex items-center space-x-2">
            <li><Link to="/" className="text-gray-500 hover:text-primary">Home</Link></li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-text">Products</span>
            </li>
            {selectedCategory && (
              <li className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-text capitalize">{selectedCategory.replace('-', ' ')}</span>
              </li>
            )}
          </ul>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-heading font-bold mb-2">
            {selectedCategory 
              ? `${selectedCategory.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}` 
              : 'All Products'}
          </h1>
          <p className="text-gray-600">
            Discover our collection of premium kitchen and home products
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={toggleMobileFilter}
            className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-md"
          >
            <span className="font-medium">Filters</span>
            <SlidersHorizontal size={18} />
          </button>
        </div>

        {/* Products Grid with Sidebar */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar - Only show on mobile if toggled */}
          <div className={`md:w-1/4 ${isMobileFilterOpen ? 'block' : 'hidden md:block'}`}>
            <ProductFilters
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              onPriceRangeChange={handlePriceRangeChange}
              onRatingChange={handleRatingChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Products Area */}
          <div className="md:w-3/4">
            {/* Sort Controls */}
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
              <div className="text-sm text-gray-600">
                Showing products
                {selectedCategory && <span> in <span className="font-medium capitalize">{selectedCategory.replace('-', ' ')}</span></span>}
                {searchQuery && <span> matching "<span className="font-medium">{searchQuery}</span>"</span>}
              </div>
              <div className="flex items-center">
                <label htmlFor="sort" className="text-sm text-gray-600 mr-2">Sort by:</label>
                <select
                  id="sort"
                  value={sortOption}
                  onChange={handleSortChange}
                  className="text-sm border border-gray-300 rounded-md p-1"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <ProductGrid 
              category={selectedCategory}
              search={searchQuery}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;