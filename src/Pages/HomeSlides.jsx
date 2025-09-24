import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Loader } from "lucide-react";
import BannerTable from "../components/HomeBanner/BannerTable.jsx";
import { useGetBanners, useDeleteBanner, useUpdateBanner } from "../api/internal.jsx";
import toast from "react-hot-toast";

const HomeBannerPage = () => {
    const navigate = useNavigate();
    const { getBanners, banners, setBanners, loading: getLoading } = useGetBanners();
    const { deleteBanner, loading: deleteLoading } = useDeleteBanner();
    const { updateBanner, loading: updateLoading } = useUpdateBanner();

    useEffect(() => {
        getBanners();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this banner?")) {
            try {
                const res = await deleteBanner(id);
                if (res.success) {
                    setBanners((prev) => prev.filter((banner) => banner._id !== id));
                    toast.success("Banner deleted successfully.");
                }
            } catch (err) {
                toast.error("Failed to delete banner.");
            }
        }
    };

    const handleEdit = (banner) => {
        navigate(`/home-slides/edit/${banner._id}`);
    };

    const toggleStatus = async (banner) => {
        const newStatus = banner.status === "Active" ? "Inactive" : "Active";
        try {
            const res = await updateBanner(banner._id, { status: newStatus });
            if (res.success) {
                setBanners((prev) =>
                    prev.map((b) => (b._id === banner._id ? res.banner : b))
                );
                toast.success("Status updated.");
            }
        } catch (err) {
            toast.error("Failed to update status.");
        }
    };

    const addNewSlide = () => {
        navigate("/home-slides/add");
    };

    const isLoading = getLoading || deleteLoading || updateLoading;

    if (getLoading && (!banners || banners.length === 0)) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Home Slider Banners
                    </h1>
                    <button
                        onClick={addNewSlide}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="font-medium">ADD HOME SLIDE</span>
                    </button>
                </div>

                {/* Table Component */}
                <BannerTable
                    banners={banners}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={toggleStatus}
                    onAddNew={addNewSlide}
                />

                {/* Footer */}
                <div className="mt-6 flex justify-between items-center text-sm text-gray-500">
                    <p>
                        Showing {(banners || []).length} banner
                        {(banners || []).length !== 1 ? "s" : ""}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HomeBannerPage;