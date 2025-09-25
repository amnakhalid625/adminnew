import axios from "axios";
import { useState, useCallback } from "react";

const BACKEND_URL = "https://backend-production-5823.up.railway.app/api";

// Create axios instance with proper configuration
const API = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true, // CRITICAL: This must be true for sessions
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor
API.interceptors.request.use(
    (config) => {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`);
        console.log('With credentials:', config.withCredentials);
        return config;
    },
    (error) => {
        console.error('❌ Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor with better error handling
API.interceptors.response.use(
    (response) => {
        console.log(`✅ ${response.status} from ${response.config.url}`);
        return response;
    },
    (error) => {
        if (error.response) {
            const { status, data } = error.response;
            console.error(`❌ ${status} Error:`, data);
            
            // Handle specific error cases
            if (status === 401) {
                console.log('🔒 Unauthorized - session may have expired');
                // You could dispatch a logout action here if using Redux
            }
            
            if (status === 403) {
                console.log('🚫 Forbidden - insufficient permissions');
            }
        } else if (error.request) {
            console.error('❌ Network error:', error.message);
        } else {
            console.error('❌ Error:', error.message);
        }
        
        return Promise.reject(error);
    }
);

// Utility function for FormData creation
const createFormData = (data) => {
    const formData = new FormData();
    for (const key in data) {
        if (key === "images" && Array.isArray(data[key])) {
            data[key].forEach((file) => {
                if (file instanceof File) {
                    formData.append("images", file);
                }
            });
        } else if (key === "image" && data[key] instanceof File) {
            formData.append("image", data[key]);
        } else if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key]);
        }
    }
    return formData;
};

// AUTHENTICATION HOOKS

export const useAdminLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const adminLogin = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('🔐 Attempting admin login...');
            
            const response = await API.post("/auth/admin-login", {
                email,
                password,
            });
            
            console.log('✅ Admin login successful:', response.data);
            
            // Optional: Test session immediately after login
            const sessionCheck = await API.get("/test-session");
            console.log('📊 Session check after login:', sessionCheck.data);
            
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 
                               err.response?.data?.error || 
                               "Admin login failed";
            console.error('❌ Admin login failed:', errorMessage);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { adminLogin, loading, error };
};

export const useLogout = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const logout = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('👋 Logging out...');
            const response = await API.post("/auth/log-out");
            console.log('✅ Logout successful');
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 
                               err.response?.data?.error || 
                               "Logout failed";
            console.error('❌ Logout failed:', errorMessage);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { logout, loading, error };
};

// DASHBOARD/STATS HOOKS

export const useGetAdminStats = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAdminStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('📊 Fetching admin stats...');
            const response = await API.get("/admin/stats");
            console.log('✅ Admin stats received:', response.data);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 
                               err.response?.data?.error || 
                               "Failed to fetch admin stats";
            console.error('❌ Failed to fetch admin stats:', errorMessage);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getAdminStats, loading, error };
};

export const useGetDashboardChartData = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getDashboardChartData = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('📈 Fetching dashboard chart data...');
            const response = await API.get("/admin/statics");
            console.log('✅ Dashboard chart data received:', response.data);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 
                               err.response?.data?.error || 
                               "Failed to fetch chart data";
            console.error('❌ Failed to fetch dashboard chart data:', errorMessage);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getDashboardChartData, loading, error };
};

// SESSION UTILITIES

export const useSessionCheck = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const checkSession = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('🔍 Checking session...');
            const response = await API.get("/test-session");
            console.log('✅ Session check result:', response.data);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 
                               err.response?.data?.error || 
                               "Session check failed";
            console.error('❌ Session check failed:', errorMessage);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { checkSession, loading, error };
};

// PRODUCT MANAGEMENT HOOKS

export const useGetProducts = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);

    const getProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('📦 Fetching products...');
            const response = await API.get("/product/");
            console.log('✅ Products received:', response.data);
            setProducts(response.data.products || []);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to fetch products";
            console.error('❌ Failed to fetch products:', errorMessage);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getProducts, products, loading, error, setProducts };
};

export const useCreateProduct = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createProduct = useCallback(async (productData) => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('➕ Creating product...');
            const formData = createFormData(productData);
            const response = await API.post("/product/admin/create-product", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            console.log('✅ Product created:', response.data);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to create product";
            console.error('❌ Failed to create product:', errorMessage);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { createProduct, loading, error };
};

// USER MANAGEMENT HOOKS

export const useGetUsers = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);

    const getUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('👥 Fetching users...');
            const response = await API.get("/user");
            console.log('✅ Users received:', response.data);
            setUsers(response.data.users || []);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to fetch users";
            console.error('❌ Failed to fetch users:', errorMessage);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getUsers, users, loading, error };
};

// Export the axios instance for direct use if needed
export { API };
export default API;