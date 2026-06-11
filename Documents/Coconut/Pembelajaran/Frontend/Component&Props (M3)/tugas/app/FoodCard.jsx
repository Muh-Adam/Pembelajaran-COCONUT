import React from "react";

export default function FoodCard({ nama, emoji, onPilih }) {
    return (
        <div className="food-card">
            <div className="flex items-center gap-3">
                <span className="text-2xl transition-transform duration-300 group-hover:scale-125">{emoji}</span>
                <span>{nama}</span>
            </div>
            <button onClick={onPilih}>Pilih</button>
        </div>
    );
}
