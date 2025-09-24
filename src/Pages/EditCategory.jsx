import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetCategory, useUpdateCategory } from "../api/internal";
import { ArrowLeft, Loader } from "lucide-react";
import toast from "react-hot-toast";
import ImageUpload from "../components/common/ImageUpload";

const EditCategory = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getCategory, loading: fetchLoading } = useGetCategory();
    const { updateCategory, loading: updateLoading, error } = useUpdateCategory();

    const [name, setName] = useState("");
    const [image, setImage] = useState(null); // For new file upload
    const [existingImageUrl, setExistingImageUrl] = useState("");

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const data = await getCategory(id);
                if (data && data.success) {
                    setName(data.category.name);
                    setExistingImageUrl(data.category.image || "");
                }
            } catch (err) {
                toast.error("Failed to fetch category data.");
            }
        };
        fetchCategoryData();
    }, [id]);

    const handleImageSelect = (files) => {
        setImage(files[0] || null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await updateCategory(id, { name, image });
            if (result && result.success) {
                toast.success("Category updated successfully!");
                navigate("/categories");
            }
        } catch (err) {
            toast.error(error || "Failed to update category.");
        }
    };

    if (fetchLoading) {
        return <div className="p-8 text-center">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/categories")}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                    Edit Category
                </h1>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="categoryName"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Category Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="categoryName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category Image
                        </label>
                        <ImageUpload
                            onUpload={handleImageSelect}
                            existingImages={existingImageUrl ? [existingImageUrl] : []}
                        />
                        <p className="text-xs text-gray-500 mt-1">Upload a new image to replace the existing one.</p>
                    </div>
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={updateLoading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 flex items-center justify-center"
                        >
                            {updateLoading ? (
                                <Loader className="animate-spin" size={20} />
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCategory;