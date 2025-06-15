import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, WishlistItem } from '../types';
import { useAuth } from './AuthContext';
import { getWishlistItems, addToWishlist as addToWishlistDB, removeFromWishlist as removeFromWishlistDB } from '../services/wishlistService';

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: Product) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  loading: boolean;
  refreshWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // Load wishlist from database when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadWishlistFromDatabase();
    } else {
      // Load from localStorage for non-authenticated users
      loadWishlistFromLocalStorage();
    }
  }, [isAuthenticated, user]);

  const loadWishlistFromDatabase = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const items = await getWishlistItems(user.id);
      setWishlistItems(items);
    } catch (error) {
      console.error('Error loading wishlist from database:', error);
      // Fallback to localStorage
      loadWishlistFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadWishlistFromLocalStorage = () => {
    try {
      const storedWishlist = localStorage.getItem('wishlist');
      if (storedWishlist) {
        const items = JSON.parse(storedWishlist);
        setWishlistItems(items);
      }
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
    }
  };

  const saveWishlistToLocalStorage = (items: WishlistItem[]) => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  };

  const refreshWishlist = () => {
    if (isAuthenticated && user) {
      loadWishlistFromDatabase();
    } else {
      loadWishlistFromLocalStorage();
    }
  };

  const addToWishlist = async (product: Product) => {
    if (isAuthenticated && user) {
      try {
        await addToWishlistDB(user.id, product.id);
        await loadWishlistFromDatabase();
      } catch (error) {
        console.error('Error adding to wishlist in database:', error);
        // Fallback to localStorage
        addToWishlistLocalStorage(product);
      }
    } else {
      addToWishlistLocalStorage(product);
    }
  };

  const addToWishlistLocalStorage = (product: Product) => {
    setWishlistItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      
      if (!existingItem) {
        const newItem: WishlistItem = {
          id: crypto.randomUUID(),
          user_id: user?.id || 'guest',
          product_id: product.id,
          created_at: new Date().toISOString(),
          product,
        };
        const newItems = [...prevItems, newItem];
        saveWishlistToLocalStorage(newItems);
        return newItems;
      }
      
      return prevItems;
    });
  };

  const removeFromWishlist = async (productId: string) => {
    if (isAuthenticated && user) {
      try {
        await removeFromWishlistDB(user.id, productId);
        await loadWishlistFromDatabase();
      } catch (error) {
        console.error('Error removing from wishlist in database:', error);
        // Fallback to localStorage
        removeFromWishlistLocalStorage(productId);
      }
    } else {
      removeFromWishlistLocalStorage(productId);
    }
  };

  const removeFromWishlistLocalStorage = (productId: string) => {
    setWishlistItems(prevItems => {
      const newItems = prevItems.filter(item => item.product.id !== productId);
      saveWishlistToLocalStorage(newItems);
      return newItems;
    });
  };

  const isInWishlist = (productId: string): boolean => {
    return wishlistItems.some(item => item.product.id === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        loading,
        refreshWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}