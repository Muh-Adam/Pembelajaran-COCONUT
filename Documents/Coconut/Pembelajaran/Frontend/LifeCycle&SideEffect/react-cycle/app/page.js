'use client';

import React, { useEffect, useState } from 'react';

export default function DemoLifecycle() {

  const [text, setText] = useState('');
  const [seconds, setSeconds] = useState(0);

  // =====================================================
  // MOUNTING
  // =====================================================
  useEffect(() => {
    console.log('🔥 Component pertama kali tampil');
  }, []);

  // =====================================================
  // DEPENDENCY ARRAY
  // =====================================================
  useEffect(() => {
    if (text === '') return;
    console.log('⚡ useEffect berjalan karena text berubah');
    return () => {
      console.log('🧹 Cleanup function berjalan');
    };
  }, [text]);

  // =====================================================
  // TIMER
  // =====================================================
  useEffect(() => {
    console.log('⏱️ Timer dimulai');
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
      console.log('🛑 Timer dihentikan');
    };
  }, []);

  const formatTime = (s) => {
    const mins = Math.floor(s / 60).toString().padStart(2, '0');
    const secs = (s % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6">

      {/* Ambient Background */}
      <div className="ambient-bg" />

      <div className="relative z-10 w-full max-w-2xl">

        <div className="glass-card p-10 md:p-14">

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black gradient-text mb-10 text-center">
            React useEffect Demo
          </h1>

          {/* INPUT */}
          <div className="mb-10">
            <p className="font-bold text-white/60 mb-3 text-sm uppercase tracking-wider">
              Ketik sesuatu:
            </p>
            <input
              id="text-input"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ketik di sini..."
              className="input-glow"
            />
          </div>

          {/* TIMER */}
          <div className="flex flex-col items-center py-10 rounded-2xl"
            style={{ background: 'rgba(124, 58, 237, 0.06)', border: '1px solid rgba(124, 58, 237, 0.12)' }}>

            <p className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-4">
              Timer useEffect
            </p>

            <div className="timer-ring">
              <div className="timer-inner text-center">
                <p className="timer-display text-5xl font-black">
                  {formatTime(seconds)}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}