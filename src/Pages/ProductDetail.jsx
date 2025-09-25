import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
    Share2,
    Truck,
    Shield,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    XIcon,
    ZoomIn,
    Loader,
} from "lucide-react";
import { useGetProduct, useAddProductReview } from "../api/internal";
import toast from "react-hot-toast";
import StarRating from "../components/Products/StarRating";

const ProductDetail = () => {
    const { id: productId } = useParams();
    const navigate = useNavigate();
    const [selectedImage, setSelectedImage] = useState(0);
    const [showImageModal, setShowImageModal] = useState(false);
    const [activeTab, setActiveTab] = useState("description");

    const { getProduct, product: productData, loading } = useGetProduct();
    const { addReview, loading: reviewLoading } = useAddProductReview();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                await getProduct(productId);
            } catch (err) {
                toast.error("Could not fetch product details.");
                navigate("/products");
            }
        };
        fetchProduct();
        // FIX: Remove `getProduct` from the dependency array.
        // The effect should only re-run when the productId from the URL changes.
    }, [productId]);

    const onReviewSubmit = async (data) => {
        try {
            await addReview(productId, data);
            toast.success("Review added successfully!");
            reset();
            // Re-fetch product to update rating and reviews list instantly
            await getProduct(productId);
        } catch (error) {
            toast.error("Failed to add review.");
        }
    };

    const getImageUrl = (path) => {
        if (!path) return 'https://via.placeholder.com/500';
        return `http://localhost:8080${path}`;
    };

    if (loading || !productData?._id) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    const nextImage = () => {
        if (productData.images && productData.images.length > 0) {
            setSelectedImage((prev) => (prev + 1) % productData.images.length);
        }
    };
    const prevImage = () => {
        if (productData.images && productData.images.length > 0) {
            setSelectedImage(
                (prev) =>
                    (prev - 1 + productData.images.length) %
                    productData.images.length
            );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="relative group">
                            <img
                                src={getImageUrl(productData.images?.[selectedImage])}
                                alt={productData.name}
                                className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-lg cursor-zoom-in"
                                onClick={() => setShowImageModal(true)}
                            />
                            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex space-x-2 overflow-x-auto pb-2">
                            {productData.images?.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? "border-blue-600" : "border-gray-200"}`}
                                >
                                    <img src={getImageUrl(image)} alt={`${productData.name} ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <p className="text-blue-600 font-medium">{productData.brand}</p>
                            <h1 className="text-3xl font-bold text-gray-900 mt-1">{productData.name}</h1>
                            <div className="flex items-center mt-3 space-x-3">
                                <StarRating rating={productData.averageRating} />
                                <span className="text-sm text-gray-600">({productData.reviews?.length || 0} reviews)</span>
                            </div>
                        </div>
                        <div className="flex items-baseline space-x-3">
                            <span className="text-3xl font-bold text-gray-900">Rs. {productData.price.toLocaleString()}</span>
                            {productData.originalPrice > productData.price && (
                                <span className="text-xl text-gray-500 line-through">Rs. {productData.originalPrice.toLocaleString()}</span>
                            )}
                        </div>
                        <p className={`text-sm font-medium ${productData.stockQuantity > 0 ? "text-green-600" : "text-red-600"}`}>
                            {productData.stockQuantity > 0 ? `In Stock (${productData.stockQuantity})` : "Out of Stock"}
                        </p>
                        <div className="space-y-3">
                            <Link to={`/products/edit/${productData._id}`} className="w-full border border-blue-600 text-blue-600 py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white duration-300">
                                Edit Product
                            </Link>
                            <button className="flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors">
                                <Share2 className="w-5 h-5" />
                                <span>Share</span>
                            </button>
                        </div>
                        <div className="border-t pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center space-x-3"><Truck className="w-6 h-6 text-blue-600" /><span className="text-sm text-gray-600">Free Delivery</span></div>
                                <div className="flex items-center space-x-3"><Shield className="w-6 h-6 text-green-600" /><span className="text-sm text-gray-600">2 Year Warranty</span></div>
                                <div className="flex items-center space-x-3"><RotateCcw className="w-6 h-6 text-yellow-700" /><span className="text-sm text-gray-600">30 Day Returns</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-16">
                    <div className="border-b border-gray-200">
                        <nav className="flex space-x-8">
                            {["description", "details", "reviews"].map((tab) => (
                                <button key={tab} onClick={() => setActiveTab(tab)} className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${activeTab === tab ? "border-blue-600 text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>
                    <div className="py-8 prose max-w-none">
                        {activeTab === "description" && <p className="text-gray-700 leading-relaxed">{productData.description}</p>}
                        {activeTab === "details" && (
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                <div className="flex flex-col"><dt className="font-medium text-gray-900">SKU</dt><dd className="text-gray-700">{productData.sku || 'N/A'}</dd></div>
                                <div className="flex flex-col"><dt className="font-medium text-gray-900">Weight</dt><dd className="text-gray-700">{productData.weight ? `${productData.weight} kg` : 'N/A'}</dd></div>
                                <div className="flex flex-col"><dt className="font-medium text-gray-900">Dimensions</dt><dd className="text-gray-700">{productData.dimensions || 'N/A'}</dd></div>
                                <div className="flex flex-col"><dt className="font-medium text-gray-900">Tags</dt><dd className="text-gray-700">{productData.tags?.join(", ") || 'None'}</dd></div>
                            </dl>
                        )}
                        {activeTab === "reviews" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Customer Reviews ({productData.reviews?.length || 0})</h3>
                                    {productData.reviews?.length > 0 ? (
                                        <div className="space-y-6">
                                            {productData.reviews.slice().reverse().map(review => (
                                                <div key={review._id} className="border-b pb-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-semibold">{review.name}</span>
                                                        <StarRating rating={review.rating} />
                                                    </div>
                                                    <p className="text-gray-600 mt-2">{review.comment}</p>
                                                    <p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No reviews yet.</p>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">Add a Review</h3>
                                    <form onSubmit={handleSubmit(onReviewSubmit)} className="space-y-4 bg-white p-6 rounded-lg border">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Rating</label>
                                            <select {...register("rating", { required: "Rating is required" })} className="form-input mt-1">
                                                <option value="">Select...</option>
                                                <option value="1">1 - Poor</option>
                                                <option value="2">2 - Fair</option>
                                                <option value="3">3 - Good</option>
                                                <option value="4">4 - Very Good</option>
                                                <option value="5">5 - Excellent</option>
                                            </select>
                                            {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Comment</label>
                                            <textarea rows="4" {...register("comment", { required: "Comment is required" })} className="form-input mt-1"></textarea>
                                            {errors.comment && <p className="text-red-500 text-xs mt-1">{errors.comment.message}</p>}
                                        </div>
                                        <button type="submit" disabled={reviewLoading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center">
                                            {reviewLoading ? <Loader className="animate-spin" size={20} /> : "Submit Review"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Image Modal */}
                {showImageModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                        <div className="relative max-w-4xl max-h-full">
                            <img src={getImageUrl(productData.images[selectedImage])} alt={productData.name} className="max-w-full max-h-[90vh] object-contain" />
                            <button onClick={() => setShowImageModal(false)} className="absolute -top-12 right-0 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors">
                                <XIcon />
                            </button>
                            <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors">
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors">
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetail;