import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { getUserProfile, updateUserProfile } from '../services/profileService';
import { UserProfile } from '../types';
import { Edit2, ShoppingBag, User, Mail, Phone, MapPin, Save, X } from 'lucide-react';

function ProfilePage() {
  const { user } = useAuth();
  const { cartItems } = useCart();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India'
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        try {
          setIsLoading(true);
          const data = await getUserProfile(user.id);
          if (data) {
            setProfile(data);
            setFormData({
              name: data.name || '',
              phone: data.phone || '',
              address: data.address || '',
              city: data.city || '',
              state: data.state || '',
              postal_code: data.postal_code || '',
              country: data.country || 'India'
            });
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.id) {
      try {
        setIsSaving(true);
        await updateUserProfile(user.id, formData);
        setProfile(prev => ({ ...prev!, ...formData }));
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile. Please try again.');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        postal_code: profile.postal_code || '',
        country: profile.country || 'India'
      });
    }
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="pt-24 pb-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="pt-24 pb-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-heading font-bold mb-4">Profile Not Found</h1>
            <p className="text-gray-600">Unable to load your profile information.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 bg-background">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold mb-2">My Profile</h1>
            <p className="text-gray-600">Manage your account information and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-heading font-semibold">Personal Information</h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-outline flex items-center gap-2"
                    >
                      <Edit2 size={18} />
                      Edit Profile
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="form-label flex items-center gap-2">
                        <User size={16} />
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="form-input"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="form-label flex items-center gap-2">
                        <Phone size={16} />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="form-input"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div>
                      <label htmlFor="address" className="form-label flex items-center gap-2">
                        <MapPin size={16} />
                        Address
                      </label>
                      <textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                        rows={3}
                        className="form-input resize-none"
                        placeholder="Enter your full address"
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label html For="city" className="form-label">City</label>
                        <input
                          type="text"
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                          className="form-input"
                          placeholder="Enter your city"
                        />
                      </div>

                      <div>
                        <label htmlFor="state" className="form-label">State</label>
                        <input
                          type="text"
                          id="state"
                          value={formData.state}
                          onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                          className="form-input"
                          placeholder="Enter your state"
                        />
                      </div>

                      <div>
                        <label htmlFor="postal_code" className="form-label">Postal Code</label>
                        <input
                          type="text"
                          id="postal_code"
                          value={formData.postal_code}
                          onChange={(e) => setFormData(prev => ({ ...prev, postal_code: e.target.value }))}
                          className="form-input"
                          placeholder="Enter postal code"
                        />
                      </div>

                      <div>
                        <label htmlFor="country" className="form-label">Country</label>
                        <input
                          type="text"
                          id="country"
                          value={formData.country}
                          onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="btn btn-outline flex items-center gap-2"
                        disabled={isSaving}
                      >
                        <X size={18} />
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-primary flex items-center gap-2"
                        disabled={isSaving}
                      >
                        <Save size={18} />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-start gap-3">
                      <User size={20} className="text-gray-400 mt-1" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                        <p className="mt-1 text-gray-900">{profile.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Mail size={20} className="text-gray-400 mt-1" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Email Address</h3>
                        <p className="mt-1 text-gray-900">{profile.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone size={20} className="text-gray-400 mt-1" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                        <p className="mt-1 text-gray-900">{profile.phone || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin size={20} className="text-gray-400 mt-1" />
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Address</h3>
                        <p className="mt-1 text-gray-900">
                          {profile.address ? (
                            <>
                              {profile.address}
                              {profile.city && <><br />{profile.city}</>}
                              {profile.state && <>, {profile.state}</>}
                              {profile.postal_code && <> {profile.postal_code}</>}
                              {profile.country && <><br />{profile.country}</>}
                            </>
                          ) : (
                            'Not provided'
                          )}
                        </p>
                      </div>
                    </div>

                    {profile.role === 'admin' && (
                      <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-sm font-medium text-primary">Administrator Account</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Account Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-heading font-semibold mb-4">Account Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Account Type</span>
                    <span className="font-medium capitalize">{profile.role}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Member Since</span>
                    <span className="font-medium">2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Cart Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingBag size={20} className="text-primary" />
                  <h3 className="text-lg font-heading font-semibold">Current Cart</h3>
                </div>

                {cartItems.length === 0 ? (
                  <p className="text-gray-500 text-sm">Your cart is empty</p>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Items in Cart</span>
                      <span className="font-medium">{cartItems.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Items</span>
                      <span className="font-medium">
                        {cartItems.reduce((total, item) => total + item.quantity, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-gray-600">Cart Value</span>
                      <span className="font-medium text-primary">
                        ₹{cartItems.reduce((total, item) => {
                          const price = item.product.discountPercentage > 0
                            ? item.product.price * (1 - item.product.discountPercentage / 100)
                            : item.product.price;
                          return total + price * item.quantity;
                        }, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-heading font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                    Order History
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                    Wishlist
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                    Support Center
                  </button>
                  {profile.role === 'admin' && (
                    <button 
                      onClick={() => window.location.href = '/admin-panel'}
                      className="w-full text-left px-3 py-2 text-sm text-primary hover:bg-primary/10 rounded-md transition-colors font-medium"
                    >
                      Admin Panel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;