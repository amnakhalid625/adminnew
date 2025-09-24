/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FiBell, FiSearch, FiUser, FiChevronDown } from "react-icons/fi";
import { useLogout } from "../../api/internal";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { logout as resetUser } from "../../Store/authSlice";

const Header = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const [notifications, setNotifications] = useState(4);

    const user = useSelector((state) => state.auth);

    const { logout, loading, error } = useLogout();

    const dispatch = useDispatch();

    const handleLogout = async () => {
        await logout();

        if (error) {
            return toast.error(error);
        }

        dispatch(resetUser());
        toast.success("Logout successfully.");
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Search Bar */}
                <div className="flex-1 max-w-xl">
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {/* Notifications */}
                    <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <FiBell size={20} className="text-gray-600" />
                        {notifications > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {notifications}
                            </span>
                        )}
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                <FiUser size={16} className="text-gray-600" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium text-gray-700">
                                    {user.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Administrator
                                </p>
                            </div>
                            <FiChevronDown
                                size={16}
                                className="text-gray-400"
                            />
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    Profile
                                </div>

                                <div
                                    onClick={handleLogout}
                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                                >
                                    {loading ? "Loading..." : "Logout"}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
