import React from "react";
import { FiStar } from "react-icons/fi";

const StarRating = ({ rating }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
        stars.push(
            <FiStar key={i} className="w-4 h-4 text-yellow-400 fill-current" />
        );
    }

    if (hasHalfStar) {
        stars.push(
            <FiStar
                key="half"
                className="w-4 h-4 text-yellow-400 fill-current opacity-50"
            />
        );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
        stars.push(
            <FiStar key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        );
    }

    return (
        <div className="flex items-center gap-1">
            {stars}
            <span className="ml-2 text-sm text-gray-600">{rating}</span>
        </div>
    );
};

export default StarRating;
