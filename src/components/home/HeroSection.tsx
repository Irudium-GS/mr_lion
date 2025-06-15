import { useNavigate } from 'react-router-dom';

function HeroSection() {
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-secondary/50 to-primary/20 pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container-custom relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left fade-in">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-text mb-4 leading-tight">
              Elegant Kitchen Essentials for the Modern Home
            </h1>
            <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto md:mx-0">
              Discover our premium collection of kitchen appliances that bring royal elegance to every home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={() => navigate('/products')}
                className="btn btn-primary py-3 px-6 text-base"
              >
                Shop Now
              </button>
              <button
                onClick={() => navigate('/about')}
                className="btn btn-outline py-3 px-6 text-base"
              >
                Learn More
              </button>
            </div>
          </div>
          <div className="md:w-1/2 relative fade-in slide-up">
            <img
              src="https://images.pexels.com/photos/6996085/pexels-photo-6996085.jpeg"
              alt="Premium Kitchen Appliances"
              className="rounded-lg shadow-xl object-cover w-full max-w-lg mx-auto"
            />
            <div className="absolute -bottom-5 -right-5 bg-accent text-white p-4 rounded-lg shadow-lg hidden md:block">
              <p className="font-heading text-lg font-bold">Summer Sale</p>
              <p className="text-sm">Up to 40% off</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent/10 rounded-full blur-3xl"></div>
    </div>
  );
}

export default HeroSection;