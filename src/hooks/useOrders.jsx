import { useState, useMemo, useEffect } from "react";
import { useGetOrders, useDeleteOrder } from "../api/internal.jsx";
import toast from "react-hot-toast";

const useOrders = () => {
    const [globalFilter, setGlobalFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [ordersData, setOrdersData] = useState([]);

    const { getOrders, loading: getLoading } = useGetOrders();
    const { deleteOrder, loading: deleteLoading } = useDeleteOrder();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getOrders();
                if (data.success) {
                    setOrdersData(data.orders);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                toast.error("Could not fetch orders.");
            }
        };

        fetchOrders();
    }, []);

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
            try {
                const res = await deleteOrder(orderId);
                if (res.success) {
                    setOrdersData((prev) =>
                        prev.filter((o) => o._id !== orderId)
                    );
                    toast.success("Order deleted successfully.");
                }
            } catch (err) {
                toast.error("Failed to delete order.");
            }
        }
    };

    const filteredData = useMemo(() => {
        let filtered = [...ordersData];
        if (statusFilter !== "all") {
            filtered = filtered.filter(
                (order) =>
                    order.orderStatus?.toLowerCase() ===
                    statusFilter.toLowerCase()
            );
        }
        if (globalFilter) {
            const term = globalFilter.toLowerCase();
            filtered = filtered.filter(
                (order) =>
                    order._id?.toLowerCase().includes(term) ||
                    order.shippingAddress?.fullName
                        ?.toLowerCase()
                        .includes(term) ||
                    order.shippingAddress?.phone?.toLowerCase().includes(term)
            );
        }
        return filtered;
    }, [ordersData, statusFilter, globalFilter]);

    const stats = useMemo(() => {
        return {
            total: ordersData.length,
            processing: ordersData.filter(
                (o) => o.orderStatus === "Processing"
            ).length,
            shipped: ordersData.filter((o) => o.orderStatus === "Shipped")
                .length,
            delivered: ordersData.filter((o) => o.orderStatus === "Delivered")
                .length,
            cancelled: ordersData.filter((o) => o.orderStatus === "Cancelled")
                .length,
            totalRevenue: ordersData.reduce(
                (sum, order) => sum + (order.totalPrice || 0),
                0
            ),
        };
    }, [ordersData]);

    return {
        data: filteredData,
        globalFilter,
        setGlobalFilter,
        statusFilter,
        setStatusFilter,
        stats,
        handleDeleteOrder,
        loading: getLoading || deleteLoading,
    };
};

export default useOrders;