import React from "react";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";

const StatsCard = ({ title, value, icon, bgColor, trend, trendUp }) => {
    return (
        <div className={`${bgColor} text-white rounded-xl p-6 stat-card`}>
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-white/20 rounded-lg">
                            {React.cloneElement(icon, { size: 24 })}
                        </div>
                    </div>
                    <p className="text-white/80 text-sm">{title}</p>
                    <p className="text-3xl font-bold mt-1">{value}</p>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1">
                        {trendUp ? (
                            <FiTrendingUp size={20} />
                        ) : (
                            <FiTrendingDown size={20} />
                        )}
                        <span className="text-sm font-medium">{trend}</span>
                    </div>
                    <div className="mt-4">
                        <svg className="w-16 h-10" viewBox="0 0 64 40">
                            <polyline
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                points="2,20 12,10 22,15 32,5 42,12 52,8 62,15"
                                opacity="0.5"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
