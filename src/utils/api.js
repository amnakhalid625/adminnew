const API_URL = "http://localhost:8080/api";

// Enhanced API request helper with better error handling and logging
const apiRequest = async (endpoint, method = 'GET', body = null) => {
    try {
        console.log(`🚀 ${method} ${endpoint}`);
        
        const config = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Critical for session cookies
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(`${API_URL}${endpoint}`, config);
        
        console.log(`📡 Response status: ${response.status} for ${endpoint}`);
        
        const data = await response.json();

        if (!response.ok) {
            console.error(`❌ API Error ${response.status}:`, data);
            throw new Error(data.message || data.error || 'Something went wrong');
        }

        console.log(`✅ Success: ${endpoint}`, data);
        return data;
    } catch (error) {
        console.error(`❌ API Error on ${method} ${endpoint}:`, error);
        throw error;
    }
};

// Authentication API functions
export const authAPI = {
    adminLogin: (credentials) => apiRequest('/auth/admin-login', 'POST', credentials),
    adminSignUp: (userData) => apiRequest('/auth/admin-sign-up', 'POST', userData),
    logout: () => apiRequest('/auth/log-out', 'POST'), // Fixed: was '/auth/logout'
    checkSession: () => apiRequest('/test-session', 'GET'), // Added session check
};

// Admin API functions
export const adminAPI = {
    getStats: () => apiRequest('/admin/stats', 'GET'),
    getStatics: () => apiRequest('/admin/statics', 'GET'),
};

// Product API functions
export const productAPI = {
    getProducts: () => apiRequest('/product/', 'GET'),
    getProduct: (id) => apiRequest(`/product/${id}`, 'GET'),
    createProduct: (productData) => {
        // For file uploads, we need to use FormData and remove Content-Type header
        const formData = new FormData();
        for (const key in productData) {
            if (key === "images" && Array.isArray(productData[key])) {
                productData[key].forEach((file) => {
                    if (file instanceof File) {
                        formData.append("images", file);
                    }
                });
            } else if (key === "image" && productData[key] instanceof File) {
                formData.append("image", productData[key]);
            } else if (productData[key] !== null && productData[key] !== undefined) {
                formData.append(key, productData[key]);
            }
        }
        
        return fetch(`${API_URL}/product/admin/create-product`, {
            method: 'POST',
            credentials: 'include',
            body: formData, // Don't set Content-Type for FormData
        }).then(response => {
            if (!response.ok) {
                throw new Error('Failed to create product');
            }
            return response.json();
        });
    },
    updateProduct: (id, productData) => apiRequest(`/product/admin/${id}`, 'PUT', productData),
    deleteProduct: (id) => apiRequest(`/product/admin/${id}`, 'DELETE'),
};

// Banner API functions
export const bannerAPI = {
    createBanner: (bannerData) => apiRequest('/banner', 'POST', bannerData),
    getBanners: () => apiRequest('/banner', 'GET'),
    getBanner: (id) => apiRequest(`/banner/${id}`, 'GET'),
    updateBanner: (id, bannerData) => apiRequest(`/banner/${id}`, 'PUT', bannerData),
    deleteBanner: (id) => apiRequest(`/banner/${id}`, 'DELETE'),
};

// Category API functions
export const categoryAPI = {
    getCategories: () => apiRequest('/category', 'GET'),
    getCategory: (id) => apiRequest(`/category/${id}`, 'GET'),
    createCategory: (categoryData) => apiRequest('/category', 'POST', categoryData),
    updateCategory: (id, categoryData) => apiRequest(`/category/${id}`, 'PUT', categoryData),
    deleteCategory: (id) => apiRequest(`/category/${id}`, 'DELETE'),
};

// Order API functions
export const orderAPI = {
    getOrders: () => apiRequest('/order', 'GET'),
    getOrder: (id) => apiRequest(`/order/${id}`, 'GET'),
    updateOrderStatus: (id, status) => apiRequest(`/order/${id}/status`, 'PUT', { status }),
    deleteOrder: (id) => apiRequest(`/order/${id}`, 'DELETE'),
};

// User API functions
export const userAPI = {
    getUsers: () => apiRequest('/user', 'GET'),
    getUser: (id) => apiRequest(`/user/${id}`, 'GET'),
};

// Health check
export const healthAPI = {
    check: () => apiRequest('/health', 'GET'),
};

export default apiRequest;