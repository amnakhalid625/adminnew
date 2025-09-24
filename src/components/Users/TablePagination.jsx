// components/TablePagination.jsx
import React from "react";

const TablePagination = () => {
    return (
        <div className="px-6 py-3 border-t bg-gray-50 flex items-center justify-between">
            <p className="text-sm text-gray-600">
                Pagination here (can extend)
            </p>
            <div className="flex space-x-2">
                <button className="px-3 py-1 border rounded">Prev</button>
                <button className="px-3 py-1 border rounded bg-blue-600 text-white">
                    1
                </button>
                <button className="px-3 py-1 border rounded">Next</button>
            </div>
        </div>
    );
};

export default TablePagination;
