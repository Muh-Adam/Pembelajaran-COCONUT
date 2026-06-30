"use client";
import React from "react";
import { useHeroState } from "./function";

export default function Hero() {
  const {
    nama,
    setNama,
    email,
    setEmail,
    barangInput,
    setBarangInput,
    daftarBarang,
    tambahBarang,
    hapusBarang
  } = useHeroState();

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Kotak Kiri: Input Nama & Email */}
        <div className="bg-white/50 dark:bg-black/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold mb-6 text-primary tracking-tight">UseState( )</h2>
          
          <div className="space-y-5 mb-8">
            <div className="group">
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Nama</label>
              <input 
                type="text" 
                placeholder="Masukkan nama Anda"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                className="w-full p-4 rounded-xl border border-gray-300/80 dark:border-gray-600/80 bg-white/50 dark:bg-gray-800/50 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300"
              />
            </div>
            <div className="group">
              <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Email</label>
              <input 
                type="email" 
                placeholder="Masukkan email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-xl border border-gray-300/80 dark:border-gray-600/80 bg-white/50 dark:bg-gray-800/50 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300"
              />
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-800/30">
            <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
              Output Profil
            </h3>
            <div className="space-y-2">
              <p className="text-sm flex justify-between border-b border-blue-200/50 dark:border-blue-800/50 pb-2">
                <span className="font-medium text-gray-600 dark:text-gray-400">Nama:</span> 
                <span className="text-gray-900 dark:text-gray-100 font-medium break-all text-right ml-4">
                  {nama || "(Nama akan muncul di sini)"}
                </span>
              </p>
              <p className="text-sm flex justify-between pt-1">
                <span className="font-medium text-gray-600 dark:text-gray-400">Email:</span> 
                <span className="text-gray-900 dark:text-gray-100 font-medium break-all text-right ml-4">
                  {email || "(Email akan muncul di sini)"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Kotak Kanan: Tambah Barang */}
        <div className="bg-white/50 dark:bg-black/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-2xl transition-shadow duration-300">
          <h2 className="text-2xl font-bold mb-6 text-primary tracking-tight">UseReducer( )</h2>
          
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <input 
              type="text" 
              placeholder="Nama barang..."
              value={barangInput}
              onChange={(e) => setBarangInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && tambahBarang()}
              className="flex-1 p-4 rounded-xl border border-gray-300/80 dark:border-gray-600/80 bg-white/50 dark:bg-gray-800/50 focus:ring-4 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all duration-300"
            />
            <button 
              onClick={tambahBarang}
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold px-6 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-green-500/30 hover:shadow-green-500/50 active:scale-95"
            >
              Tambah
            </button>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-5 rounded-2xl min-h-[160px] border border-green-100 dark:border-green-800/30 max-h-64 overflow-y-auto">
            <h3 className="font-semibold text-green-800 dark:text-green-300 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Output Barang
            </h3>
            
            <ul className="space-y-3">
              {daftarBarang.length === 0 ? (
                <li className="text-gray-500 dark:text-gray-400 italic text-sm text-center py-4 bg-white/40 dark:bg-black/20 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                  Belum ada barang. (Daftar barang akan muncul di sini)
                </li>
              ) : (
                daftarBarang.map((barang, index) => (
                  <li key={index} className="flex items-center justify-between gap-3 bg-white/60 dark:bg-gray-800/60 p-3 rounded-lg border border-green-200/50 dark:border-green-700/50 shadow-sm group hover:border-green-400 dark:hover:border-green-500 transition-colors">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center text-xs font-bold text-green-800 dark:text-green-200">
                        {index + 1}
                      </span>
                      <span className="font-medium text-gray-800 dark:text-gray-200 truncate">{barang}</span>
                    </div>
                    <button 
                      onClick={() => hapusBarang(index)}
                      className="text-red-500 hover:text-white hover:bg-red-500 p-1.5 rounded-md transition-colors opacity-100 sm:opacity-0 sm:group-hover:opacity-100 flex-shrink-0"
                      title="Hapus barang"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                      </svg>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
