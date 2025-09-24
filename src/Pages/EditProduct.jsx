import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, Loader } from "lucide-react";
import ImageUpload from "../components/common/ImageUpload";
import { useGetProduct, useUpdateProduct } from "../api/internal";
import { toast } from "react-hot-toast";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getProduct, product, loading: fetchLoading } = useGetProduct();
    const { updateProduct, error, loading: updateLoading } = useUpdateProduct();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    // Fetch product data when the component mounts
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // Fetch the product using the ID from the URL
                await getProduct(id);
            } catch (err) {
                toast.error("Failed to fetch product data.");
                navigate("/products");
            }
        };
        fetchProduct();
        // FIX: Remove `getProduct` from the dependency array to prevent an infinite loop.
        // The effect should only re-run when the `id` changes.
    }, [id]);

    // Populate the form with the fetched product data
    useEffect(() => {
        if (product) {
            Object.keys(product).forEach(key => {
                if (key === 'tags' && Array.isArray(product[key])) {
                    setValue(key, product[key].join(', '));
                } else {
                    setValue(key, product[key]);
                }
            });
        }
    }, [product, setValue]);

    // Handle new image uploads
    const handleImageUpload = (files) => {
        setValue("images", files, { shouldValidate: true });
    };

    // Form submission handler
    const onSubmit = async (data) => {
        try {
            if (!data.images || data.images.length === 0) {
                delete data.images;
            }

            const res = await updateProduct(id, data);

            if (res.success) {
                toast.success("Product updated successfully.");
                navigate(`/products/view/${id}`);
            }
        } catch (err) {
            toast.error(error || "Product update failed.");
        }
    };

    // Display a loader while fetching data
    if (fetchLoading || !product) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-xl font-bold text-gray-800 ml-2">
                    Edit Product
                </h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Product Name & Brand */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Product Name *</label>
                        <input type="text" {...register("name", { required: "Product name is required" })} className="form-input mt-1" />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Brand *</label>
                        <input type="text" {...register("brand", { required: "Brand is required" })} className="form-input mt-1" />
                        {errors.brand && <p className="text-red-500 text-xs mt-1">{errors.brand.message}</p>}
                    </div>
                </div>
                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description *</label>
                    <textarea rows="4" {...register("description", { required: "Description is required" })} className="form-input mt-1"></textarea>
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                </div>
                {/* Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Category *</label>
                        <input type="text" {...register("category", { required: "Category is required" })} className="form-input mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sub Category</label>
                        <input type="text" {...register("subCategory")} className="form-input mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Third Level Category</label>
                        <input type="text" {...register("thirdLevelCategory")} className="form-input mt-1" />
                    </div>
                </div>
                {/* Pricing & Stock */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Original Price *</label>
                        <input type="number" step="0.01" {...register("originalPrice", { required: true, valueAsNumber: true, min: 0 })} className="form-input mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Sale Price *</label>
                        <input type="number" step="0.01" {...register("price", { required: true, valueAsNumber: true, min: 0 })} className="form-input mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Stock Quantity *</label>
                        <input type="number" {...register("stockQuantity", { required: true, valueAsNumber: true, min: 0 })} className="form-input mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">SKU</label>
                        <input type="text" {...register("sku")} className="form-input mt-1" />
                    </div>
                </div>
                {/* Weight, Dimensions, Tags */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                        <input type="number" step="0.01" {...register("weight", { valueAsNumber: true })} placeholder="0.0" className="form-input mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Dimensions (L x W x H)</label>
                        <input type="text" {...register("dimensions")} placeholder="e.g., 10 x 5 x 3 cm" className="form-input mt-1" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
                        <input type="text" {...register("tags")} placeholder="e.g., electronics, phone, new" className="form-input mt-1" />
                    </div>
                </div>
                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                    <ImageUpload onUpload={handleImageUpload} existingImages={product.images || []} />
                    <p className="text-xs text-gray-500 mt-1">Uploading new images will replace all existing ones.</p>
                </div>
                <div className="flex justify-end pt-4 border-t">
                    <button type="submit" disabled={updateLoading} className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center justify-center">
                        {updateLoading ? <Loader size={20} className="animate-spin" /> : "SAVE CHANGES"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;