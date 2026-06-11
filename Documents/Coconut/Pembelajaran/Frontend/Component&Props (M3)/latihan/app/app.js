'use client'

import React, { useState } from "react";
import FoodList from "./foodlist";

export default function App(){
    const dataMakanan = ["Nasi Goreng", "Sate Ayam", "Bakso", "Mie Goreng", "Gado-gado"];

    const [menuMakanan, setMenuMakanan] = useState(null);
    return(
        <div>
            <h1>Daftar Makanan</h1>

            {menuMakanan ? (
                <p>Kamu memilih: <strong>{menuMakanan}</strong></p>
            ) : (
                <p>Belum ada menu yang dipilih.</p>
            )}

            <FoodList dataMakanan={dataMakanan} onPilih={setMenuMakanan}/>
        </div>
    );
}