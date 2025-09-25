import React from "react";
import { Edit, Trash2, Plus, Loader } from "lucide-react";

const BannerTable = ({
    banners,
    isLoading,
    onEdit,
    onDelete,
    onToggleStatus,
    onAddNew,
}) => {
    // Helper to construct full image URL
    const getImageUrl = (path) => {
        if (!path) return "";
        return `http://localhost:8080${path}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden border">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 w-auto">
                            BANNER
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 w-32">
                            STATUS
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 w-28">
                            ACTION
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {(banners || []).map((banner) => (
                        <tr
                            key={banner._id}
                            className="hover:bg-gray-50 transition-colors"
                        >
                            <td className="px-6 py-4 align-top w-auto">
                                {/* MODIFICATION START: Display only the image */}
                                {banner.image && (
                                    <div
                                        className="w-full md:w-96 h-36 rounded-lg overflow-hidden shadow-lg bg-gray-200 flex items-center justify-center"
                                        style={{ backgroundColor: banner.backgroundColor }}
                                    >
                                        <img
                                            src={getImageUrl(banner.image)}
                                            alt={banner.title}
                                            className="h-full w-auto object-contain"
                                        />
                                    </div>
                                )}
                                {/* MODIFICATION END */}
                            </td>
                            <td className="px-6 py-4 align-middle w-32">
                                <button
                                    onClick={() => onToggleStatus(banner)}
                                    disabled={isLoading}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${banner.status === "Active"
                                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                        }`}
                                >
                                    {banner.status}
                                </button>
                            </td>
                            <td className="px-6 py-4 align-middle w-28">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => onEdit(banner)}
                                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit Banner"
                                    >
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(banner._id)}
                                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Banner"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Loader className="animate-spin" size={20} />
                                        ) : (
                                            <Trash2 className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Empty State */}
            {!isLoading && (!banners || banners.length === 0) && (
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-2">
                        <Plus className="w-12 h-12 mx-auto mb-4" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No banners found
                    </h3>
                    <p className="text-gray-500 mb-4">
                        Get started by creating your first home slider banner.
                    </p>
                    <button
                        onClick={onAddNew}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Add Your First Banner
                    </button>
                </div>
            )}
        </div>
    );
};

export default BannerTable;