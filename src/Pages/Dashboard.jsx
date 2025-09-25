import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import {
    FiUsers,
    FiShoppingCart,
    FiPackage,
    FiTag,
    FiPlus,
    FiAlertCircle,
    FiRefreshCw
} from "react-icons/fi";

// Import your components
import StatsCard from "../components/Dashboard/StatesCard";
import Charts from "../components/Dashboard/Chart.jsx";
import ProductTable from "../components/Products/ProductsTable";
import useProducts from "../hooks/useProducts";

// Import the fixed API hooks
import { useGetAdminStats, useSessionCheck } from "../api/internal.jsx";

const Dashboard = () => {
    const navigate = useNavigate();
    const { getAdminStats, loading: statsLoading, error: statsError } = useGetAdminStats();
    const { checkSession, loading: sessionLoading } = useSessionCheck();
    
    const [stats, setStats] = useState(null);
    const [sessionValid, setSessionValid] = useState(false);
    const [retryCount, setRetryCount] = useState(0);

    // Get user info from Redux
    const adminInfo = useSelector((state) => state.orebiReducer?.adminInfo);
    const userInfo = useSelector((state) => state.orebiReducer?.userInfo);
    const user = adminInfo || userInfo;

    // Product table hooks
    const {
        data,
        globalFilter,
        setGlobalFilter,
        rowSelection,
        setRowSelection,
        handleEditProduct,
        handleDeleteProduct,
    } = useProducts();

    // Function to verify session and fetch stats
    const initializeDashboard = async () => {
        try {
            console.log('Initializing dashboard...');
            
            // First, check if session is valid
            const sessionData = await checkSession();
            console.log('Session check result:', sessionData);
            
            if (!sessionData.hasUser || !sessionData.isAdmin) {
                console.log('Invalid session or not admin, redirecting to login');
                toast.error('Please log in as admin to access dashboard');
                navigate('/dashboard');
                return;
            }
            
            setSessionValid(true);
            
            // If session is valid, fetch stats
            console.log('Session valid, fetching stats...');
            const statsData = await getAdminStats();
            console.log('Stats received:', statsData);
            setStats(statsData);
            
            toast.success('Dashboard loaded successfully');
            
        } catch (error) {
            console.error('Dashboard initialization error:', error);
            
            if (error.response?.status === 401) {
                console.log('Unauthorized, redirecting to login');
                toast.error('Session expired. Please log in again.');
                navigate('/admin/login');
            } else {
                console.log('Error fetching dashboard data:', error.message);
                toast.error(`Failed to load dashboard: ${error.message}`);
                // Set empty stats to stop loading state
                setStats({});
            }
        }
    };

    // Retry function
    const handleRetry = () => {
        setRetryCount(prev => prev + 1);
        setStats(null);
        setSessionValid(false);
    };

    // Initialize dashboard on component mount and when retry is clicked
    useEffect(() => {
        initializeDashboard();
    }, [retryCount]); // Re-run when retryCount changes

    // Dashboard stats configuration
    const dashboardStats = [
        {
            title: "Total Users",
            value: stats?.totalUsers || 0,
            icon: <FiUsers />,
            bgColor: "bg-green-500",
            trend: "+12%",
            trendUp: true,
        },
        {
            title: "Total Orders",
            value: stats?.totalOrders || 0,
            icon: <FiShoppingCart />,
            bgColor: "bg-blue-500",
            trend: "+8%",
            trendUp: true,
        },
        {
            title: "Total Products",
            value: stats?.totalProducts || 0,
            icon: <FiPackage />,
            bgColor: "bg-purple-500",
            trend: "+5%",
            trendUp: true,
        },
        {
            title: "Total Categories",
            value: stats?.totalCategories || 0,
            icon: <FiTag />,
            bgColor: "bg-red-500",
            trend: "0%",
            trendUp: false,
        },
    ];

    // Loading state
    if (statsLoading || sessionLoading || stats === null) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-600">Loading dashboard...</p>
                    <p className="text-sm text-gray-500">Verifying session and fetching data</p>
                </div>
            </div>
        );
    }

    // Error state with retry option
    if (statsError && !sessionValid) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center bg-red-50 p-8 rounded-lg max-w-md">
                    <FiAlertCircle className="text-red-500 text-6xl mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-red-700 mb-2">Dashboard Access Error</h2>
                    <p className="text-red-600 mb-4">{statsError}</p>
                    <p className="text-sm text-gray-600 mb-6">
                        This usually means your session has expired or you don't have admin permissions.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={handleRetry}
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FiRefreshCw size={16} />
                            Retry
                        </button>
                        <br />
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="inline-flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Main dashboard render
    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            Welcome,{" "}
                            <span className="text-blue-600">
                                {user?.name || user?.email || 'Admin'}
                            </span>
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Here's what's happening on your store today. See the
                            statistics at once.
                        </p>
                        <Link
                            to="/products/add"
                            className="mt-4 inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FiPlus size={20} />
                            Add Product
                        </Link>
                    </div>
                    <div className="hidden lg:block">
                        <div className="w-64 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                            <span className="text-white text-lg font-semibold">Dashboard</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Session Status Indicator (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
                <div className="bg-green-50 border-l-4 border-green-400 p-4">
                    <div className="flex">
                        <div className="ml-3">
                            <p className="text-sm text-green-700">
                                <strong>Dashboard Status:</strong> {sessionValid ? 'Session Valid' : 'Session Invalid'} | 
                                <strong> Stats Loaded:</strong> {stats ? 'Yes' : 'No'} |
                                <strong> Retry Count:</strong> {retryCount}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            {/* Products Section */}
            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Products</h2>
                </div>
                <ProductTable
                    data={data}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    rowSelection={rowSelection}
                    setRowSelection={setRowSelection}
                    onEditProduct={handleEditProduct}
                    onDeleteProduct={handleDeleteProduct}
                />
            </div>

            {/* Charts Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Analytics Overview</h2>
                <Charts />
            </div>

            {/* Debug Panel (Development Only) */}
            {process.env.NODE_ENV === 'development' && stats && (
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 mb-2">Debug Information</h3>
                    <pre className="text-xs text-gray-600 bg-white p-3 rounded overflow-auto">
                        {JSON.stringify({ 
                            sessionValid, 
                            hasStats: !!stats, 
                            statsKeys: stats ? Object.keys(stats) : [],
                            userInfo: user ? { name: user.name, email: user.email } : null
                        }, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

export default Dashboard;