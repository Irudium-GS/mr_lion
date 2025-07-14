const API_BASE_URL = 'http://localhost:8000/api';

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Create headers with auth token
const createHeaders = (includeAuth: boolean = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Generic API request function
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {},
  includeAuth: boolean = true
): Promise<any> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = createHeaders(includeAuth);

  const config: RequestInit = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// API service object
export const api = {
  // Auth endpoints
  auth: {
    register: (userData: { name: string; email: string; password: string }) =>
      apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }, false),

    login: (credentials: { email: string; password: string }) =>
      apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }, false),

    logout: () =>
      apiRequest('/auth/logout', { method: 'POST' }),

    me: () =>
      apiRequest('/auth/me'),

    refresh: () =>
      apiRequest('/auth/refresh', { method: 'POST' }),
  },

  // Products endpoints
  products: {
    getAll: (params?: Record<string, any>) => {
      const queryString = params ? '?' + new URLSearchParams(params).toString() : '';
      return apiRequest(`/products${queryString}`, {}, false);
    },

    getById: (id: string) =>
      apiRequest(`/products/${id}`, {}, false),

    getFeatured: () =>
      apiRequest('/products/featured', {}, false),

    create: (productData: any) =>
      apiRequest('/admin/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      }),

    update: (id: string, productData: any) =>
      apiRequest(`/admin/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      }),

    delete: (id: string) =>
      apiRequest(`/admin/products/${id}`, { method: 'DELETE' }),
  },

  // Categories endpoints
  categories: {
    getAll: () =>
      apiRequest('/categories', {}, false),

    getById: (id: string) =>
      apiRequest(`/categories/${id}`, {}, false),
  },

  // Cart endpoints
  cart: {
    getItems: () =>
      apiRequest('/cart'),

    addItem: (productId: string, quantity: number) =>
      apiRequest('/cart', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId, quantity }),
      }),

    updateItem: (productId: string, quantity: number) =>
      apiRequest(`/cart/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity }),
      }),

    removeItem: (productId: string) =>
      apiRequest(`/cart/${productId}`, { method: 'DELETE' }),

    clear: () =>
      apiRequest('/cart', { method: 'DELETE' }),
  },

  // Wishlist endpoints
  wishlist: {
    getItems: () =>
      apiRequest('/wishlist'),

    addItem: (productId: string) =>
      apiRequest('/wishlist', {
        method: 'POST',
        body: JSON.stringify({ product_id: productId }),
      }),

    removeItem: (productId: string) =>
      apiRequest(`/wishlist/${productId}`, { method: 'DELETE' }),

    checkItem: (productId: string) =>
      apiRequest(`/wishlist/check/${productId}`),
  },
};

export default api;