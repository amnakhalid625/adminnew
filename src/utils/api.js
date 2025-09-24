const API_URL = "https://backend-production-5823.up.railway.app/api"; // Base API URL (removed /admin)

// A helper function to handle API requests
const apiRequest = async (endpoint, method = 'GET', body = null) => {
    try {
        const config = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // ✅ ADD THIS - Most Important!
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error(`API Error on ${method} ${endpoint}:`, error);
        throw error;
    }
};

// Specific API functions for different modules
export const authAPI = {
    adminLogin: (credentials) => apiRequest('/auth/admin-login', 'POST', credentials),
    adminSignUp: (userData) => apiRequest('/auth/admin-sign-up', 'POST', userData),
    logout: () => apiRequest('/auth/logout', 'POST'),
};

export const adminAPI = {
    getStats: () => apiRequest('/admin/stats', 'GET'),
    getStatics: () => apiRequest('/admin/statics', 'GET'),
};

export const productAPI = {
    getProducts: () => apiRequest('/product/', 'GET'),
};

export const bannerAPI = {
    createBanner: (bannerData) => apiRequest('/banner', 'POST', bannerData),
    getBanners: () => apiRequest('/banner', 'GET'),
};

export default apiRequest;