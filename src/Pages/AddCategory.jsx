import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader } from "lucide-react";
import ImageUpload from "../components/common/ImageUpload";
import { useCreateCategory } from "../api/internal";
import toast from "react-hot-toast";

const AddCategory = () => {
    const navigate = useNavigate();
    const { createCategory, loading, error } = useCreateCategory();

    const [name, setName] = useState("");
    const [image, setImage] = useState(null);

    const handleImageSelect = (files) => {
        setImage(files[0] || null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await createCategory({ name, image });
            if (result.success) {
                toast.success("Category created successfully!");
                navigate("/categories"); // go back to category list
            }
        } catch (err) {
            toast.error(error || "Failed to create category");
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
                    Add New Category
                </h1>
            </div>

            <form
                className="space-y-6 max-w-2xl mx-auto"
                onSubmit={handleSubmit}
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        Category Name *
                    </label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter category name"
                        className="form-input mt-1 w-full border rounded-lg px-3 py-2"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category Image
                    </label>
                    <ImageUpload onUpload={handleImageSelect} />
                </div>
                <div className="flex justify-end pt-4 border-t">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center justify-center"
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

export default AddCategory;