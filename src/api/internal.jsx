import axios from "axios";
import { useState, useCallback } from "react";

const BACKEND_URL = "http://localhost:8080/api";

const API = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true, // This is already correct
});

API.defaults.headers.common["Content-Type"] = "application/json";

// Enhanced request interceptor for better debugging
API.interceptors.request.use(
    (config) => {
        console.log('🚀 Making request to:', config.url, 'with credentials:', config.withCredentials);
        return config;
    },
    (error) => {
        console.error('❌ Request error:', error);
        return Promise.reject(error);
    }
);

// Enhanced response interceptor with better error handling
API.interceptors.response.use(
    (response) => {
        console.log('✅ Response received:', response.status, 'from:', response.config.url);
        return response;
    },
    (error) => {
        if (error.response) {
            console.error('❌ Response error:', error.response?.status, error.response?.data);
            
            if (error.response?.status === 401) {
                console.log('🔒 Unauthorized - session may have expired');
            }
            
            if (error.response?.status === 403) {
                console.log('🚫 Forbidden - insufficient permissions');
            }
        } else if (error.request) {
            console.error('❌ Network error - no response received');
        } else {
            console.error('❌ Request setup error:', error.message);
        }
        
        return Promise.reject(error);
    }
);

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

// Keep your existing dashboard stats hook
export const useGetDashboardStats = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getDashboardStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('📊 Fetching dashboard stats...');
            const res = await API.get("/admin/stats");
            console.log('✅ Dashboard stats received:', res.data);
            return res.data;
        } catch (err) {
            console.error('❌ Failed to fetch dashboard stats:', err.response?.data);
            const errorMessage = err.response?.data?.message || err.response?.data?.error || "Get Stats failed";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getDashboardStats, loading, error };
};

// Enhanced useGetAdminStats with better error handling
export const useGetAdminStats = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getAdminStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('📊 Fetching admin stats...');
            const res = await API.get("/admin/stats");
            console.log('✅ Admin stats received:', res.data);
            return res.data;
        } catch (err) {
            console.error('❌ Failed to fetch admin stats:', err.response?.data);
            const errorMessage = err.response?.data?.message || err.response?.data?.error || "Failed to fetch admin stats";
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
            const res = await API.get("/admin/statics");
            console.log('✅ Dashboard chart data received:', res.data);
            return res.data;
        } catch (err) {
            console.error('❌ Failed to fetch dashboard chart data:', err.response?.data);
            const errorMessage = err.response?.data?.message || err.response?.data?.error || "Get chart data failed";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getDashboardChartData, loading, error };
};

// Enhanced login hooks with better session handling
export const useLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            console.log('🔐 Attempting admin login...');
            const res = await API.post("/auth/admin-login", {
                email,
                password,
            });
            console.log('✅ Admin login successful:', res.data);
            
            // Optional: Verify session immediately after login
            try {
                const testRes = await API.get("/admin/stats");
                console.log('✅ Session verification successful');
            } catch (sessionError) {
                console.warn('⚠️ Session verification failed:', sessionError.message);
            }
            
            return res.data;
        } catch (err) {
            console.error('❌ Admin login failed:', err.response?.data);
            const errorMessage = err.response?.data?.message || err.response?.data?.error || "Login failed";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { login, loading, error };
};

export const useAdminLogin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const adminLogin = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            console.log('🔐 Attempting admin login...');
            const res = await API.post("/auth/admin-login", {
                email,
                password,
            });
            console.log('✅ Admin login successful:', res.data);
            
            // Test session immediately after login
            try {
                const testRes = await API.get("/admin/stats");
                console.log('✅ Session test successful - user is properly authenticated');
            } catch (sessionError) {
                console.warn('⚠️ Session test failed after login:', sessionError.message);
            }
            
            return res.data;
        } catch (err) {
            console.error('❌ Admin login failed:', err.response?.data);
            const errorMessage = err.response?.data?.message || err.response?.data?.error || "Admin login failed";
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
            const res = await API.post("/auth/log-out");
            console.log('✅ Logout successful');
            return res.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.response?.data?.error || "Logout failed";
            console.error('❌ Logout failed:', errorMessage);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { logout, loading, error };
};

// Add session check utility hook
export const useSessionCheck = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const checkSession = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            console.log('🔍 Checking session status...');
            const res = await API.get("/auth/test-session");
            console.log('✅ Session check result:', res.data);
            
            // Enhanced validation - check both user existence and admin role
            const sessionData = res.data;
            const isValidAdmin = sessionData.hasUser && 
                               sessionData.user && 
                               sessionData.user.role === 'admin';
                               
            console.log('Session validation:', {
                hasUser: sessionData.hasUser,
                userRole: sessionData.user?.role,
                isValidAdmin
            });
            
            return {
                ...sessionData,
                isAdmin: isValidAdmin
            };
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.response?.data?.error || "Session check failed";
            console.error('❌ Session check failed:', errorMessage);
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { checkSession, loading, error };
};

// ***********************************
//  USERS
// ***********************************

export const useGetUsers = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);

    const getUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.get("/user");
            setUsers(res.data.users);
            return res.data;
        } catch (err) {
            const errorMessage =
                err.response?.data?.error || "Failed to fetch users";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getUsers, users, loading, error };
};

// ============================================================================
// PRODUCT MANAGEMENT HOOKS
// ============================================================================

export const useGetProducts = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState([]);

    const getProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.get("/product/");
            setProducts(res.data.products);
            return res.data;
        } catch (err) {
            const errorMessage =
                err.response?.data?.error || "Failed to fetch products";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getProducts, products, loading, error, setProducts };
};

export const useGetProduct = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [product, setProduct] = useState(null);

    const getProduct = useCallback(async (productId) => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.get(`/product/${productId}`);
            setProduct(res.data.product);
            return res.data;
        } catch (err) {
            const errorMessage =
                err.response?.data?.error || "Failed to fetch product";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getProduct, product, loading, error };
};

export const useCreateProduct = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createProduct = useCallback(async (productData) => {
        setLoading(true);
        setError(null);
        try {
            const formData = createFormData(productData);
            const res = await API.post(
                "/product/admin/create-product",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            return res.data;
        } catch (err) {
            const errorMessage =
                err.response?.data?.error || "Failed to create product";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { createProduct, loading, error };
};

export const useUpdateProduct = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateProduct = useCallback(async (productId, productData) => {
        setLoading(true);
        setError(null);
        try {
            const formData = createFormData(productData);
            const res = await API.put(`/product/admin/${productId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data;
        } catch (err) {
            const errorMessage =
                err.response?.data?.error || "Failed to update product";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { updateProduct, loading, error };
};

export const useDeleteProduct = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteProduct = useCallback(async (productId) => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.delete(`/product/admin/${productId}`);
            return res.data;
        } catch (err) {
            const errorMessage =
                err.response?.data?.error || "Failed to delete product";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { deleteProduct, loading, error };
};

// ============================================================================
// ORDER MANAGEMENT HOOKS
// ============================================================================

export const useGetOrders = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [orders, setOrders] = useState([]);

    const getOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.get("/order");
            setOrders(res.data.orders);
            return res.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to fetch orders";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getOrders, orders, loading, error };
};

export const useGetOrder = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [order, setOrder] = useState(null);

    const getOrder = useCallback(async (orderId) => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.get(`/order/${orderId}`);
            setOrder(res.data.data);
            return res.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to fetch order";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getOrder, order, loading, error };
};

export const useUpdateOrderStatus = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateOrderStatus = useCallback(async (orderId, status) => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.put(`/order/${orderId}/status`, { status });
            return res.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to update order status";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { updateOrderStatus, loading, error };
};

export const useDeleteOrder = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteOrder = useCallback(async (orderId) => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.delete(`/order/${orderId}`);
            return res.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to delete order";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { deleteOrder, loading, error };
};

// ============================================================================
// BANNER MANAGEMENT HOOKS
// ============================================================================

export const useGetBanners = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [banners, setBanners] = useState([]);

    const getBanners = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.get("/banner");
            setBanners(res.data.banners);
            return res.data;
        } catch (err) {
            const errorMessage =
                err.response?.data?.error || "Failed to fetch banners";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getBanners, banners, loading, error, setBanners };
};

export const useGetBanner = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [banner, setBanner] = useState(null);

    const getBanner = useCallback(async (bannerId) => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.get(`/banner/${bannerId}`);
            setBanner(res.data.banner);
            return res.data;
        } catch (err) {
            const errorMessage =
                err.response?.data?.error || "Failed to fetch banner";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getBanner, banner, loading, error };
};

export const useCreateBanner = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createBanner = useCallback(async (bannerData) => {
        setLoading(true);
        setError(null);
        try {
            const formData = createFormData(bannerData);
            const res = await API.post("/banner", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data;
        } catch (err) {
            const errorMessage =
                err.response?.data?.error || "Failed to create banner";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { createBanner, loading, error };
};

export const useUpdateBanner = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateBanner = useCallback(async (bannerId, bannerData) => {
        setLoading(true);
        setError(null);
        try {
            const formData = createFormData(bannerData);
            const res = await API.put(`/banner/${bannerId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data;
        } catch (err) {
            const errorMessage =
                err.response?.data?.error || "Failed to update banner";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { updateBanner, loading, error };
};

export const useDeleteBanner = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteBanner = useCallback(async (bannerId) => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.delete(`/banner/${bannerId}`);
            return res.data;
        } catch (err) {
            const errorMessage =
                err.response?.data?.error || "Failed to delete banner";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { deleteBanner, loading, error };
};

// ============================================================================
// CATEGORY MANAGEMENT HOOKS
// ============================================================================

export const useGetCategories = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);

    const getCategories = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.get("/category");
            setCategories(res.data.categories);
            return res.data;
        } catch (err) {
            const errorMessage =
                err.response?.data?.error || "Failed to fetch categories";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getCategories, categories, loading, error, setCategories };
};

export const useGetCategory = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [category, setCategory] = useState(null);

    const getCategory = useCallback(async (categoryId) => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.get(`/category/${categoryId}`);
            setCategory(res.data.category);
            return res.data;
        } catch (err) {
            const errorMessage =
                err.response?.data?.error || "Failed to fetch category";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { getCategory, category, loading, error };
};

export const useCreateCategory = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const createCategory = useCallback(async (categoryData) => {
        setLoading(true);
        setError(null);
        try {
            const formData = createFormData(categoryData);
            const res = await API.post("/category", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data;
        } catch (err) {
            const errorMessage =
                err.response?.data?.error || "Failed to create category";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { createCategory, loading, error };
};

export const useUpdateCategory = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateCategory = useCallback(async (categoryId, categoryData) => {
        setLoading(true);
        setError(null);
        try {
            const formData = createFormData(categoryData);
            const res = await API.put(`/category/${categoryId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data;
        } catch (err) {
            const errorMessage =
                err.response?.data?.error || "Failed to update category";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { updateCategory, loading, error };
};

export const useDeleteCategory = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteCategory = useCallback(async (categoryId) => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.delete(`/category/${categoryId}`);
            return res.data;
        } catch (err) {
            const errorMessage =
                err.response?.data?.error || "Failed to delete category";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { deleteCategory, loading, error };
};

export const useAdminSignUp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const adminSignUp = useCallback(async (name, email, password) => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.post("/auth/admin-sign-up", {
                name,
                email,
                password,
            });
            return res.data;
        } catch (err) {
            const errorMessage =
                err.response?.data?.message || "Sign-up failed";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    return { adminSignUp, loading, error };
};

export const useAddProductReview = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const addReview = useCallback(async (productId, reviewData) => {
        setLoading(true);
        setError(null);
        try {
            const res = await API.post(`/product/admin/${productId}/reviews`, reviewData);
            return res.data;
        } catch (err) {
            const errorMessage = err.response?.data?.error || "Failed to add review";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { addReview, loading, error };
};

// Export the API instance for direct use if needed
export { API };
export default API;