import { useNavigate } from 'react-router-dom';

function CategorySection() {
  const navigate = useNavigate();
  
  const categories = [
    {
      id: 'kitchen-essentials',
      name: 'Kitchen Essentials',
      description: 'Must-have tools for your culinary adventures',
      image: 'https://images.pexels.com/photos/6996052/pexels-photo-6996052.jpeg',
    },
    {
      id: 'cookware',
      name: 'Cookware',
      description: 'Premium pots, pans, and bakeware',
      image: 'https://images.pexels.com/photos/6605308/pexels-photo-6605308.jpeg',
    },
    {
      id: 'appliances',
      name: 'Appliances',
      description: 'Modern technology for your kitchen',
      image: 'https://images.pexels.com/photos/4112715/pexels-photo-4112715.jpeg',
    },
  ];

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/products?category=${categoryId}`);
  };

  return (
    <section className="py-16 bg-background">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Explore our carefully curated categories of premium home and kitchen products
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <div 
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="group relative overflow-hidden rounded-lg shadow-md cursor-pointer fade-in"
            >
              <div className="relative h-64">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h3 className="text-xl font-heading font-semibold mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-200 mb-4">{category.description}</p>
                  <span className="inline-block py-2 px-4 bg-white/20 rounded-md text-white text-sm backdrop-blur-sm transition-colors group-hover:bg-primary">
                    Shop Now
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySection;