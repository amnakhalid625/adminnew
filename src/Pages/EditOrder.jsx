import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetOrder, useUpdateOrderStatus } from "../api/internal";
import { ArrowLeft, Loader } from "lucide-react";
import toast from "react-hot-toast";
import StatusBadge from "../components/Orders/StatusBadge";

const EditOrder = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { getOrder, order, loading: fetchLoading } = useGetOrder();
    const {
        updateOrderStatus,
        loading: updateLoading,
        error,
    } = useUpdateOrderStatus();

    const [status, setStatus] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                await getOrder(id);
            } catch (err) {
                toast.error("Failed to fetch order data.");
                navigate("/orders");
            }
        };
        fetchOrder();
    }, [id]);

    useEffect(() => {
        if (order) {
            setStatus(order.orderStatus);
        }
    }, [order]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await updateOrderStatus(id, status);
            if (result.success) {
                toast.success("Order status updated successfully!");
                navigate("/orders");
            }
        } catch (err) {
            toast.error(error || "Failed to update order status.");
        }
    };

    if (fetchLoading || !order)
        return (
            <div className="p-8 text-center">
                <Loader className="animate-spin mx-auto" />
            </div>
        );

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/orders")}
                    className="p-2 rounded-full hover:bg-gray-100"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900">
                    Edit Order #{order._id.substring(0, 8)}...
                </h1>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm border max-w-2xl mx-auto">
                <div className="mb-6 space-y-2">
                    <p className="text-gray-600">
                        <strong>Customer:</strong> {order.shippingAddress.fullName}
                    </p>
                    <p className="text-gray-600">
                        <strong>Total Price:</strong> Rs{" "}
                        {order.totalPrice.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-2">
                        <p className="text-gray-600">
                            <strong>Current Status:</strong>
                        </p>
                        <StatusBadge status={order.orderStatus} />
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label
                            htmlFor="status"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Update Order Status{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                        >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
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
                                "Update Status"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditOrder;