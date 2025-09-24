import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

const ProductsHeader = () => {
    return (
        <div className="bg-white px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                <Link
                    to={"/products/add"}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                >
                    <FiPlus className="w-4 h-4" />
                    ADD PRODUCT
                </Link>
            </div>
        </div>
    );
};

export default ProductsHeader;
