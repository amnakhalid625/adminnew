import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Loader } from "lucide-react";
import ImageUpload from "../components/common/ImageUpload";
import { useCreateBanner } from "../api/internal";
import toast from "react-hot-toast";

const AddHomeSlide = () => {
    const navigate = useNavigate();
    const { createBanner, loading, error } = useCreateBanner();
    const [image, setImage] = useState(null);

    const handleImageSelect = (files) => {
        setImage(files[0] || null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            return toast.error("An image is required to create a slide.");
        }

        try {
            // Only send the image. The backend will use the filename as the title.
            const bannerData = {
                image: image,
            };

            const result = await createBanner(bannerData);
            if (result.success) {
                toast.success("Home slide created successfully!");
                navigate("/home-slides");
            }
        } catch (err) {
            toast.error(error || "Failed to create home slide.");
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
                    Add New Home Slide
                </h1>
            </div>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 max-w-2xl mx-auto"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image Upload *
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

export default AddHomeSlide;