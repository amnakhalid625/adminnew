import React, { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useGetOrder } from "../api/internal";
import { ArrowLeft, Loader } from "lucide-react";
import toast from "react-hot-toast";
import StatusBadge from "../components/Orders/StatusBadge";

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getOrder, order, loading, error } = useGetOrder();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                await getOrder(id);
            } catch (err) {
                toast.error("Failed to fetch order details.");
                navigate("/orders");
            }
        };
        fetchOrder();
    }, [id]);

    if (loading || !order) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    if (error) {
        return <p className="text-red-500 text-center">{error}</p>
    }

    const subtotal = order.orderItems.reduce((acc, item) => {
        const price = item.product?.price || 0;
        return acc + price * item.quantity;
    }, 0);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex items-center mb-6">
                <button
                    onClick={() => navigate("/orders")}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>
                <div className="ml-4">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Order Details
                    </h1>
                    <p className="text-sm text-gray-500 font-mono">ID: {order._id}</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Products and Summary */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800 p-4 border-b">
                            Order Items ({order.orderItems.length})
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Product</th>
                                        <th className="px-4 py-3 font-medium text-center">Quantity</th>
                                        <th className="px-4 py-3 font-medium text-right">Unit Price</th>
                                        <th className="px-4 py-3 font-medium text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {order.orderItems.map((item) => (
                                        <tr key={item.product?._id || item._id}>
                                            <td className="p-4 flex items-center gap-4">
                                                <img
                                                    src={item.product?.images?.[0] ? `http://localhost:8080${item.product.images[0]}` : 'https://via.placeholder.com/64'}
                                                    alt={item.product?.name}
                                                    className="w-16 h-16 rounded-md object-cover bg-gray-100"
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-800">{item.product?.name || 'Product not found'}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                                            <td className="px-4 py-3 text-right text-gray-600">Rs {item.product?.price.toLocaleString() || 0}</td>
                                            <td className="px-4 py-3 text-right font-medium text-gray-800">Rs {(item.quantity * (item.product?.price || 0)).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer and Shipping Info */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Order Summary</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between"><span className="text-gray-600">Order Created:</span> <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Payment Method:</span> <span className="font-medium">{order.paymentMethod}</span></div>
                            <div className="flex justify-between items-center"><span className="text-gray-600">Status:</span> <StatusBadge status={order.orderStatus} /></div>
                            <div className="flex justify-between pt-2 border-t mt-2"><span className="text-gray-600">Subtotal:</span> <span className="font-medium">Rs {subtotal.toLocaleString()}</span></div>
                            <div className="flex justify-between"><span className="text-gray-600">Shipping:</span> <span className="font-medium">Rs {order.shippingPrice.toLocaleString()}</span></div>
                            <div className="flex justify-between text-base"><span className="font-semibold text-gray-800">Total:</span> <span className="font-bold text-lg text-gray-900">Rs {order.totalPrice.toLocaleString()}</span></div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Customer Details</h3>
                        <div className="space-y-2 text-sm">
                            <p className="font-medium text-gray-800">{order.shippingAddress.fullName}</p>
                            <p className="text-gray-600">{order.user?.email || 'No email provided'}</p>
                            <p className="text-gray-600">{order.shippingAddress.phone}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Shipping Address</h3>
                        <address className="text-sm text-gray-600 not-italic">
                            {order.shippingAddress.address}<br />
                            {order.shippingAddress.city}, {order.shippingAddress.zipCode}
                        </address>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;