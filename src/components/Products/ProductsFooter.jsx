import React from "react";

const ProductsFooter = ({
    totalProducts,
    displayedProducts,
    selectedCount,
    currentPage,
    totalPages,
    onPreviousPage,
    onNextPage,
}) => {
    return (
        <div className="bg-white px-6 py-4 border-t border-gray-200 sticky bottom-0">
            <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">
                    Showing {displayedProducts} of {totalProducts} products
                    {selectedCount > 0 && (
                        <span className="ml-2 text-blue-600 font-semibold">
                            ({selectedCount} selected)
                        </span>
                    )}
                </p>
                <div className="flex items-center gap-2">
                    <button
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        onClick={onPreviousPage}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded">
                        Page {currentPage} of {totalPages || 1}
                    </span>
                    <button
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        onClick={onNextPage}
                        disabled={currentPage === totalPages || totalPages === 0}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductsFooter;