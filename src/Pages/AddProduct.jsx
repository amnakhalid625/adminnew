import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft, Loader } from "lucide-react";
import ImageUpload from "../components/common/ImageUpload";
import { useCreateProduct } from "../api/internal";
import { toast } from "react-hot-toast";

const AddProduct = () => {
    const navigate = useNavigate();
    const { createProduct, error, loading } = useCreateProduct();

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const handleImageUpload = (files) => {
        setValue("images", files, { shouldValidate: true });
    };

    const onSubmit = async (data) => {
        try {
            const res = await createProduct(data);

            if (res.success) {
                navigate(`/products`);
                toast.success("Product created successfully.");
            }
        } catch (err) {
            console.error("Product creation failed:", err);
            toast.error(error || "Product creation failed");
        }
    };

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
                    Add New Product
                </h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Product Name & Brand */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            {...register("name", {
                                required: "Product name is required",
                            })}
                            placeholder="Enter product name"
                            className="form-input mt-1"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.name.message}
                            </p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Brand *
                        </label>
                        <input
                            type="text"
                            {...register("brand", {
                                required: "Brand is required",
                            })}
                            placeholder="Enter brand name"
                            className="form-input mt-1"
                        />
                        {errors.brand && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.brand.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Description *
                    </label>
                    <textarea
                        rows="4"
                        {...register("description", {
                            required: "Description is required",
                        })}
                        placeholder="Enter product description"
                        className="form-input mt-1"
                    ></textarea>
                    {errors.description && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.description.message}
                        </p>
                    )}
                </div>

                {/* Categories */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Category *
                        </label>
                        <input
                            type="text"
                            {...register("category", {
                                required: "Category is required",
                            })}
                            placeholder="Enter category"
                            className="form-input mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Sub Category *
                        </label>
                        <input
                            type="text"
                            {...register("subCategory", {
                                required: "Sub Category is required",
                            })}
                            placeholder="Enter sub category"
                            className="form-input mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Third Level Category
                        </label>
                        <input
                            type="text"
                            {...register("thirdLevelCategory")}
                            placeholder="Enter third level category"
                            className="form-input mt-1"
                        />
                    </div>
                </div>

                {/* Pricing & Stock */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Original Price *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            {...register("originalPrice", {
                                required: true,
                                valueAsNumber: true,
                                min: 0,
                            })}
                            placeholder="0.00"
                            className="form-input mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Sale Price *
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            {...register("price", {
                                required: true,
                                valueAsNumber: true,
                                min: 0,
                            })}
                            placeholder="0.00"
                            className="form-input mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Stock Quantity *
                        </label>
                        <input
                            type="number"
                            {...register("stockQuantity", {
                                required: true,
                                valueAsNumber: true,
                                min: 0,
                            })}
                            placeholder="0"
                            className="form-input mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            SKU
                        </label>
                        <input
                            type="text"
                            {...register("sku")}
                            placeholder="Enter SKU"
                            className="form-input mt-1"
                        />
                    </div>
                </div>

                {/* Weight, Dimensions, Tags */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Weight (kg)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            {...register("weight", { valueAsNumber: true })}
                            placeholder="0.0"
                            className="form-input mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Dimensions (L x W x H)
                        </label>
                        <input
                            type="text"
                            {...register("dimensions")}
                            placeholder="e.g., 10 x 5 x 3 cm"
                            className="form-input mt-1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Tags (comma-separated)
                        </label>
                        <input
                            type="text"
                            {...register("tags")}
                            placeholder="e.g., electronics, phone, new"
                            className="form-input mt-1"
                        />
                    </div>
                </div>

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Images *
                    </label>
                    <ImageUpload onUpload={handleImageUpload} />
                    <input
                        type="hidden"
                        {...register("images", {
                            required: "At least one image is required",
                        })}
                    />
                    {errors.images && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.images.message}
                        </p>
                    )}
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center justify-center"
                    >
                        {loading ? (
                            <Loader className="animate-spin" size={20} />
                        ) : (
                            "PUBLISH AND VIEW"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;