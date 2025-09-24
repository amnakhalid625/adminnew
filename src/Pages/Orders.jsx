import OrdersHeader from "../components/Orders/OrdersHeader.jsx";
import OrdersTable from "../components/Orders/OrdersTable.jsx";
import useOrders from "../hooks/useOrders.jsx";

const OrdersPage = () => {
    const {
        data,
        globalFilter,
        setGlobalFilter,
        statusFilter,
        setStatusFilter,
        stats,
        handleDeleteOrder,
    } = useOrders();

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <div className="w-6 h-6 bg-blue-600 rounded"></div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Total Orders
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.total}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <div className="w-6 h-6 bg-yellow-600 rounded"></div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Processing
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.processing}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <div className="w-6 h-6 bg-green-600 rounded"></div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Delivered
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stats.delivered}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex items-center">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <div className="w-6 h-6 bg-purple-600 rounded"></div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                Total Revenue
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                Rs {stats.totalRevenue.toLocaleString("en-IN")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Header with Search and Filters */}
            <OrdersHeader
                globalFilter={globalFilter}
                onGlobalFilterChange={setGlobalFilter}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
            />

            {/* Orders Table */}
            <OrdersTable
                data={data}
                globalFilter={globalFilter}
                onGlobalFilterChange={setGlobalFilter}
                onDeleteOrder={handleDeleteOrder}
            />
        </div>
    );
};

export default OrdersPage;