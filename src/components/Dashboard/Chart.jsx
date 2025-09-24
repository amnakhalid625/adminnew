import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";
import { useEffect, useState } from "react";
import { useGetDashboardChartData } from "../../api/internal"; // adjust path

const Chart = () => {
    const { getDashboardChartData, loading, error } =
        useGetDashboardChartData();
    const [data, setData] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const chartData = await getDashboardChartData();
                console.log("Dashboard chart data:", chartData); // 👀 check if totalOrders is included
                setData(chartData);
            } catch (err) {
                console.error("Chart data fetch failed:", err);
            }
        })();
    }, []);

    const formatYAxisTick = (value) => {
        if (value >= 1_000_000) return `${value / 1_000_000}M`;
        if (value >= 1_000) return `${value / 1_000}K`;
        return value.toString();
    };

    if (loading) return <p>Loading chart...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="w-full" style={{ height: "400px" }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                    barCategoryGap="20%"
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f0f0f0"
                        vertical={false}
                    />
                    <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#666" }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: "#666" }}
                        tickFormatter={formatYAxisTick}
                        domain={[0, "dataMax"]}
                    />
                    <Tooltip
                        cursor={{ fill: "rgba(0,0,0,0.05)" }}
                        contentStyle={{
                            borderRadius: "8px",
                            border: "1px solid #e5e7eb",
                            fontSize: "12px",
                        }}
                        formatter={(value, name) => {
                            if (name === "totalUsers") return [value, "Users"];
                            if (name === "totalSales") return [value, "Sales"];
                            if (name === "totalOrders")
                                return [value, "Orders"];
                            return [value, name];
                        }}
                    />
                    <Legend
                        verticalAlign="top"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ fontSize: "12px" }}
                    />
                    <Bar
                        dataKey="totalUsers"
                        fill="#3B82F6"
                        radius={[4, 4, 0, 0]}
                        name="Users"
                    />
                    <Bar
                        dataKey="totalSales"
                        fill="#10B981"
                        radius={[4, 4, 0, 0]}
                        name="Sales"
                    />
                    <Bar
                        dataKey="totalOrders"
                        fill="#F59E0B"
                        radius={[4, 4, 0, 0]}
                        name="Orders"
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Chart;
