import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetBanner, useUpdateBanner } from "../api/internal";
import { ArrowLeft, Loader } from "lucide-react";
import toast from "react-hot-toast";
import ImageUpload from "../components/common/ImageUpload";

const EditHomeSlide = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getBanner, loading: fetchLoading } = useGetBanner();
    const { updateBanner, loading: updateLoading, error } = useUpdateBanner();

    const [image, setImage] = useState(null); // For new file upload
    const [existingImageUrl, setExistingImageUrl] = useState("");

    useEffect(() => {
        const fetchBannerData = async () => {
            try {
                const data = await getBanner(id);
                if (data && data.success) {
                    setExistingImageUrl(data.banner.image || "");
                }
            } catch (err) {
                toast.error("Failed to fetch banner data.");
                navigate("/home-slides");
            }
        };
        fetchBannerData();
    }, [id]);

    const handleImageSelect = (files) => {
        setImage(files[0] || null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!image) {
            return toast.error("Please upload a new image to save changes.");
        }
        try {
            const result = await updateBanner(id, { image });
            if (result && result.success) {
                toast.success("Banner image updated successfully!");
                navigate("/home-slides");
            }
        } catch (err) {
            toast.error(error || "Failed to update banner.");
        }
    };

    if (fetchLoading)
        return (
            <div className="p-8 text-center">
                <Loader className="animate-spin mx-auto" />
            </div>
        );

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
                    Edit Home Slide Image
                </h1>
            </div>
            <form
                onSubmit={handleSubmit}
                className="space-y-6 max-w-2xl mx-auto"
            >
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload New Image *
                    </label>
                    <ImageUpload
                        onUpload={handleImageSelect}
                        existingImages={
                            existingImageUrl ? [existingImageUrl] : []
                        }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Uploading a new image will replace the existing one.
                    </p>
                </div>
                <div className="flex justify-end pt-4 border-t">
                    <button
                        type="submit"
                        disabled={updateLoading}
                        className="w-full px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center justify-center"
                    >
                        {updateLoading ? (
                            <Loader className="animate-spin" size={20} />
                        ) : (
                            "SAVE CHANGES"
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};
export default EditHomeSlide;