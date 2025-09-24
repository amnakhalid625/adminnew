import React from "react";
import { FiSearch } from "react-icons/fi";

const ProductsFilters = ({
    categories,
    subCategories,
    selectedCategory,
    setSelectedCategory,
    selectedSubCategory,
    setSelectedSubCategory,
    selectedThirdLevel,
    setSelectedThirdLevel,
    globalFilter,
    setGlobalFilter,
}) => {
    return (
        <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row items-end gap-4">
                <div className="flex-1 w-full md:w-auto">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category By
                    </label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {/* FIX: Added key prop */}
                        {(categories || []).map((cat, index) => (
                            <option key={cat + index} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex-1 w-full md:w-auto">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sub Category By
                    </label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={selectedSubCategory}
                        onChange={(e) => setSelectedSubCategory(e.target.value)}
                    >
                        <option value="">All Sub Categories</option>
                        {/* FIX: Added key prop */}
                        {(subCategories || []).map((subCat, index) => (
                            <option key={subCat + index} value={subCat}>
                                {subCat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex-1 w-full md:w-auto">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Third Level Sub Category By
                    </label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={selectedThirdLevel}
                        onChange={(e) => setSelectedThirdLevel(e.target.value)}
                    >
                        <option value="">Select Third Level</option>
                        {/* Add options here if you have data for them */}
                    </select>
                    
                </div>

                <div className="flex-1 w-full md:w-auto">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Search
                    </label>
                    <div className="relative">
                        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search here..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={globalFilter ?? ""}
                            onChange={(e) => setGlobalFilter(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsFilters;