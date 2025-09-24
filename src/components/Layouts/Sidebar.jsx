import {
    Sidebar as ProSidebar,
    Menu,
    MenuItem,
    SubMenu,
} from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import {
    FiPackage,
    FiUsers,
    FiShoppingCart,
    FiImage,
    FiGrid,
    FiSettings,
    FiLogOut,
    FiChevronLeft,
    FiChevronRight,
    FiTag,
    FiList,
    FiPlus,
} from "react-icons/fi";
import { FaShoppingCart } from "react-icons/fa";
import { useLogout } from "../../api/internal";
import { useDispatch } from "react-redux";
import { logout as resetUser } from "../../Store/authSlice";
import toast from "react-hot-toast";

const Sidebar = ({ collapsed, setCollapsed }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const { logout, loading, error } = useLogout();

    const menuItems = [
        {
            title: "Dashboard",
            path: "/dashboard",
            icon: <FiGrid size={20} />,
        },
        {
            title: "Home Slides",
            path: "/home-slides",
            icon: <FiImage size={20} />,
            subNav: [
                {
                    title: "Home Slides List",
                    path: "/home-slides/",
                    icon: <FiList size={16} />,
                },
                {
                    title: "Home Slides Add",
                    path: "/home-slides/add",
                    icon: <FiPlus size={16} />,
                },
            ],
        },
        {
            title: "Category",
            path: "/categories",
            icon: <FiTag size={20} />,
            subNav: [
                {
                    title: "Category List",
                    path: "/categories/",
                    icon: <FiList size={16} />,
                },
                {
                    title: "Category Add",
                    path: "/categories/add",
                    icon: <FiPlus size={16} />,
                },
            ],
        },
        {
            title: "Products",
            path: "/products",
            icon: <FiPackage size={20} />,
            subNav: [
                {
                    title: "Products List",
                    path: "/products",
                    icon: <FiList size={16} />,
                },
                {
                    title: "Products Add",
                    path: "/products/add",
                    icon: <FiPlus size={16} />,
                },
            ],
        },
        {
            title: "Users",
            path: "/users",
            icon: <FiUsers size={20} />,
        },
        {
            title: "Orders",
            path: "/orders",
            icon: <FiShoppingCart size={20} />,
        },
    ];

    const isActive = (path) => location.pathname === path;

    const handleLogout = async () => {
        await logout();

        if (error) {
            return toast.error(error);
        }

        dispatch(resetUser());
        toast.success("Logout successfully.");
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="h-screen flex flex-col bg-white border-r border-gray-200">
            {/* Logo Section */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <Link to="/" className="flex items-center gap-2">
                    <FaShoppingCart className="text-red-500 text-2xl" />
                    {!collapsed && (
                        <div>
                            <span className="text-xl font-bold text-gray-800">
                                CLASSYSHOP
                            </span>
                            <span className="block text-xs text-gray-500">
                                BIG MEGA STORE
                            </span>
                        </div>
                    )}
                </Link>
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    {collapsed ? (
                        <FiChevronRight size={20} />
                    ) : (
                        <FiChevronLeft size={20} />
                    )}
                </button>
            </div>
            {/* Menu Items */}
            <ProSidebar
                collapsed={collapsed}
                className="flex-1"
                style={{ border: "none" }}
            >
                <Menu>
                    {menuItems.map((item) =>
                        item.subNav ? (
                            <SubMenu
                                key={item.path}
                                icon={item.icon}
                                label={item.title} // ✅ use label instead of title
                                className={`${
                                    isActive(item.path)
                                        ? "bg-blue-50 text-blue-600 border-r-3 border-blue-600"
                                        : "hover:bg-gray-50"
                                }`}
                            >
                                {item.subNav.map((sub) => (
                                    <MenuItem
                                        key={sub.path}
                                        icon={sub.icon}
                                        component={<Link to={sub.path} />}
                                        className={`${
                                            isActive(sub.path)
                                                ? "bg-blue-100 text-blue-600 border-r-2 border-blue-600"
                                                : "hover:bg-gray-50"
                                        }`}
                                    >
                                        {sub.title}
                                    </MenuItem>
                                ))}
                            </SubMenu>
                        ) : (
                            <MenuItem
                                key={item.path}
                                icon={item.icon}
                                component={<Link to={item.path} />}
                                className={`${
                                    isActive(item.path)
                                        ? "bg-blue-50 text-blue-600 border-r-3 border-blue-600"
                                        : "hover:bg-gray-50"
                                }`}
                            >
                                {item.title}
                            </MenuItem>
                        )
                    )}
                </Menu>
            </ProSidebar>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700"
                >
                    <FiLogOut size={20} />
                    {!collapsed && <span>Logout</span>}
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
