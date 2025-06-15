import { useState, useEffect } from 'react';
import { FilterX, SlidersHorizontal } from 'lucide-react';
import { getCategories } from '../../services/productService';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  parent_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ProductFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onPriceRangeChange: (min: number, max: number) => void;
  onRatingChange: (rating: number) => void;
  onClearFilters: () => void;
}

function ProductFilters({
  selectedCategory,
  onCategoryChange,
  onPriceRangeChange,
  onRatingChange,
  onClearFilters,
}: ProductFiltersProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [rating, setRating] = useState<number>(0);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handlePriceRangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPriceRangeChange(minPrice, maxPrice);
  };

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    onRatingChange(newRating);
  };

  const handleClearFilters = () => {
    setMinPrice(0);
    setMaxPrice(10000);
    setRating(0);
    onClearFilters();
  };

  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  return (
    <div>
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

      {/* Filter Panel - Desktop always visible, Mobile toggle */}
      <div 
        className={`bg-white rounded-lg shadow-sm p-4 md:block transition-all duration-300 ${
          isMobileFilterOpen ? 'block' : 'hidden'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Filters</h3>
          <button 
            onClick={handleClearFilters}
            className="text-sm text-primary flex items-center"
          >
            <FilterX size={16} className="mr-1" />
            Clear All
          </button>
        </div>

        {/* Categories */}
        <div className="mb-6">
          <h4 className="font-medium mb-2 text-sm">Categories</h4>
          <div className="space-y-1">
            <div 
              onClick={() => onCategoryChange('')}
              className={`cursor-pointer px-2 py-1 text-sm rounded-md ${
                selectedCategory === '' ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'
              }`}
            >
              All Products
            </div>
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => onCategoryChange(category.slug)}
                className={`cursor-pointer px-2 py-1 text-sm rounded-md ${
                  selectedCategory === category.slug ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'
                }`}
              >
                {category.name}
              </div>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h4 className="font-medium mb-2 text-sm">Price Range</h4>
          <form onSubmit={handlePriceRangeSubmit} className="space-y-3">
            <div className="flex space-x-2">
              <div className="w-1/2">
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  placeholder="Min"
                  className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md"
                />
              </div>
              <div className="w-1/2">
                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  placeholder="Max"
                  className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-1 px-3 text-sm bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
            >
              Apply
            </button>
          </form>
        </div>

        {/* Rating Filter */}
        <div>
          <h4 className="font-medium mb-2 text-sm">Rating</h4>
          <div className="space-y-1">
            {[4, 3, 2, 1].map((star) => (
              <div
                key={star}
                onClick={() => handleRatingChange(star)}
                className={`cursor-pointer flex items-center px-2 py-1 text-sm rounded-md ${
                  rating === star ? 'bg-primary/10 text-primary' : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex text-gold">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill={i < star ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={i < star ? "" : "text-gray-300"}
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <span className="ml-1">{star}+ stars</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductFilters;