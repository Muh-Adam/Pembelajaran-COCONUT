'use client'
import React from "react";
import {useState, useEffect} from 'react';

export default function Home() {

  const [barang, setBarang] = useState('')
  const [daftarBarang, setDaftarBarang] = useState([])


  const tambahBarang = () => {
    if (barang.trim() !== '') {
      setDaftarBarang([...daftarBarang, barang]);
      setBarang('');
    }
  }

  const hapusBarang = (index) => {
    const newDaftar = [...daftarBarang];
    newDaftar.splice(index, 1);
    setDaftarBarang(newDaftar);
  }

  return (

        <div style={{ border: '1px solid black', padding: '10px', marginBottom: '10px' }}>
            <h2>Input Barang</h2>
            <input
                type="text"
                value={barang}
                onChange={(e) => setBarang(e.target.value)}
                placeholder="Masukkan nama barang"
            />
            <button onClick={tambahBarang}>Tambah</button>

            <ul>
                {daftarBarang.map((item, index) => (
                    <li key={index}>
                        {item}
                        <button
                        className="border bg-lime-300 text-black rounded-md ml-[8rem]"
                        onClick={() => hapusBarang(index)}>Hapus</button>
                    </li>
                ))}
            </ul>
        </div>


  );
}
