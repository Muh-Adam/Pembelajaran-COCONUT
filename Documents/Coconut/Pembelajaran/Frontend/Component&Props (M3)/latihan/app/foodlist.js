import React from "react";

export default function FoodList({ dataMakanan, onPilih }){
    return(
        <div>
            <ul>
                {dataMakanan.map((item, index) => (
                    <li key={index}>
                        {item}
                        <button onClick={() => onPilih(item)}
                         className="border bg-lime-300 text-black rounded-md ml-[8rem]">Pilih</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}