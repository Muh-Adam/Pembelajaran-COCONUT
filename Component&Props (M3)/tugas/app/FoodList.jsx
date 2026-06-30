import React from "react";
import FoodCard from "./FoodCard";

export default function FoodList({ dataMakanan, onPilih }) {
    return (
        <div className="food-list">
            {dataMakanan.map((item, index) => (
                <FoodCard 
                    key={index} 
                    nama={item.nama} 
                    emoji={item.emoji}
                    onPilih={() => onPilih(item)} 
                />
            ))}
        </div>
    );
}
