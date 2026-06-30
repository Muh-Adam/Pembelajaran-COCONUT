'use client'

import React, { useState } from "react";
import FoodList from "./FoodList";

export default function App() {
    const dataMakanan = [
        { nama: "Nasi Goreng", emoji: "🍛" },
        { nama: "Sate Ayam", emoji: "🍢" },
        { nama: "Bakso", emoji: "🍜" },
        { nama: "Mie Goreng", emoji: "🍝" },
        { nama: "Gado-gado", emoji: "🥗" }
    ];

    const [menuDipilih, setMenuDipilih] = useState(null);

    return (
        <div className="app-container">
            <h1 className="app-title">🍽️ Daftar Menu Makanan</h1>
            <p className="app-subtitle">Pilih menu favoritmu!</p>

            <div className={`banner ${menuDipilih ? "selected" : "empty"}`}>
                {menuDipilih ? (
                    <p className="flex items-center justify-center gap-2">
                        Kamu memilih: <span className="text-xl">{menuDipilih.emoji}</span> <strong>{menuDipilih.nama}</strong>
                    </p>
                ) : (
                    <p>Belum ada menu yang dipilih.</p>
                )}
            </div>

            <FoodList dataMakanan={dataMakanan} onPilih={setMenuDipilih} />
        </div>
    );
}
