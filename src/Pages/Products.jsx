import ProductsHeader from "../components/Products/ProductsHeader.jsx";
import ProductsFilters from "../components/Products/ProductsFilters.jsx";
import ProductsTable from "../components/Products/ProductsTable.jsx";
import ProductsFooter from "../components/Products/ProductsFooter.jsx";
import useProducts from "../hooks/useProducts.jsx";
import { Loader } from "lucide-react";

const ProductsPage = () => {
    const {
        data,
        loading,
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
        rowSelection,
        setRowSelection,
        currentPage,
        totalPages,
        handlePreviousPage,
        handleNextPage,
        handleEditProduct,
        handleDeleteProduct,
        stats,
    } = useProducts();

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            <ProductsHeader />
            <ProductsFilters
                categories={categories}
                subCategories={subCategories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedSubCategory={selectedSubCategory}
                setSelectedSubCategory={setSelectedSubCategory}
                selectedThirdLevel={selectedThirdLevel}
                setSelectedThirdLevel={setSelectedThirdLevel}
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
            />
            {loading && data.length === 0 ? (
                <div className="flex-1 flex items-center justify-center bg-white">
                    <Loader className="animate-spin text-blue-600" size={48} />
                </div>
            ) : (
                <ProductsTable
                    data={data}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    rowSelection={rowSelection}
                    setRowSelection={setRowSelection}
                    onEditProduct={handleEditProduct}
                    onDeleteProduct={handleDeleteProduct}
                />
            )}
            <ProductsFooter
                totalProducts={stats.totalProducts}
                displayedProducts={stats.displayedProducts}
                selectedCount={stats.selectedCount}
                currentPage={currentPage}
                totalPages={totalPages}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
            />
        </div>
    );
};

export default ProductsPage;