'use client'

import React from "react"
import { useState, useEffect } from "react"

export default function Home() {
  const [text,setText] = useState(''); 

  useEffect(() => {
    console.log("Component pertama kali tampil");
  },[]);

  useEffect(() => {
    if (text==='') return;
    console.log("Ini berubah");
    return () =>
      console.log("cleanup")
  },[text]);



  return (
    <div className="justify-center items-center mt-4">
      <h1 className="text-[2rem] font-bold justify-center flex">UseEffect Demo</h1>
        <div className="flex justify-center items-center mb-10 p-8">
          <input
          type="text"
          placeholder="inputan"
          className="rounded-md border border-gray-300 p-2"
          onChange={(e) => setText(e.target.value)}>
          </input>
        </div>
    </div>
  )
}

