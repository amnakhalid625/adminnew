const API_URL = "https://backend-production-5823.up.railway.app/api";

// A helper function to handle API requests
const apiRequest = async (endpoint, method = 'GET', body = null) => {
    try {
        const config = {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // ✅ ADD THIS LINE - Most Important!
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

// Specific admin API functions
export const adminAPI = {
    // Admin Login
    login: (credentials) => apiRequest('/auth/admin-login', 'POST', credentials),
    
    // Admin Signup  
    signup: (userData) => apiRequest('/auth/admin-sign-up', 'POST', userData),
    
    // Get Admin Stats
    getStats: () => apiRequest('/admin/stats', 'GET'),
    
    // Get Admin Statics
    getStatics: () => apiRequest('/admin/statics', 'GET'),
    
    // Logout
    logout: () => apiRequest('/auth/logout', 'POST'),
};

export default apiRequest;