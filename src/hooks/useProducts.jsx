import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetProducts, useDeleteProduct } from "../api/internal";
import toast from "react-hot-toast";

const useProducts = () => {
    const navigate = useNavigate();
    // State for the complete, unfiltered list of products from the DB
    const [allProducts, setAllProducts] = useState([]);

    // State for filters and pagination
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubCategory, setSelectedSubCategory] = useState("");
    const [selectedThirdLevel, setSelectedThirdLevel] = useState("");
    const [globalFilter, setGlobalFilter] = useState("");
    const [rowSelection, setRowSelection] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // You can adjust this value

    const { getProducts, loading: getLoading } = useGetProducts();
    const { deleteProduct, loading: deleteLoading } = useDeleteProduct();

    // Fetch all products once when the component mounts
    useEffect(() => {
        const fetchAllProducts = async () => {
            try {
                const data = await getProducts();
                if (data.success) {
                    setAllProducts(data.products);
                }
            } catch (error) {
                toast.error("Failed to fetch products.");
            }
        };
        fetchAllProducts();
    }, []);

    // Memoized filtering logic applied to the full product list
    const filteredData = useMemo(() => {
        let filtered = [...allProducts];

        if (selectedCategory) {
            filtered = filtered.filter(
                (product) => product.category === selectedCategory
            );
        }
        if (selectedSubCategory) {
            filtered = filtered.filter(
                (product) => product.subCategory === selectedSubCategory
            );
        }
        if (selectedThirdLevel) {
            filtered = filtered.filter(
                (product) => product.thirdLevelCategory === selectedThirdLevel
            );
        }

        if (globalFilter) {
            const lower = globalFilter.toLowerCase();
            filtered = filtered.filter(
                (product) =>
                    product.name?.toLowerCase().includes(lower) ||
                    product.brand?.toLowerCase().includes(lower) ||
                    product.sku?.toLowerCase().includes(lower)
            );
        }

        return filtered;
    }, [
        selectedCategory,
        selectedSubCategory,
        selectedThirdLevel,
        globalFilter,
        allProducts,
    ]);

    // Memoized pagination logic applied to the filtered list
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredData.slice(startIndex, endIndex);
    }, [filteredData, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleEditProduct = (product) => {
        navigate(`/products/edit/${product._id}`);
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const res = await deleteProduct(productId);
                if (res.success) {
                    // Update the main list, which will re-trigger filtering and pagination
                    setAllProducts((prev) =>
                        prev.filter((p) => p._id !== productId)
                    );
                    toast.success("Product deleted successfully.");
                }
            } catch (err) {
                toast.error("Failed to delete product.");
            }
        }
    };

    const handlePreviousPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    // Reset to page 1 whenever filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, selectedSubCategory, selectedThirdLevel, globalFilter]);

    return {
        data: paginatedData, // The component uses the paginated data
        loading: getLoading || deleteLoading,
        // Filters are derived from the complete list of products
        categories: useMemo(() => [...new Set(allProducts.map(p => p.category))], [allProducts]),
        subCategories: useMemo(() => [...new Set(allProducts.map(p => p.subCategory).filter(Boolean))], [allProducts]),
        selectedCategory,
        setSelectedCategory,
        selectedSubCategory,
        setSelectedSubCategory,
        selectedThirdLevel,
        setSelectedThirdLevel,
        globalFilter,
        setGlobalFilter,
        rowSelection,
        setRowSelection,
        currentPage,
        totalPages,
        handlePreviousPage,
        handleNextPage,
        handleEditProduct,
        handleDeleteProduct,
        stats: {
            totalProducts: filteredData.length, // Show count of filtered items
            displayedProducts: paginatedData.length,
            selectedCount: Object.keys(rowSelection).length,
        },
    };
};

export default useProducts;