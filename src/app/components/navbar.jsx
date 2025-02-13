"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <div className="navbar bg-white text-gray-800 shadow-md fixed w-full top-0 left-0 z-50 px-4 py-2 flex items-center justify-between max-w-full overflow-hidden ">
      {/* Логотип */}
      <div className="navbar-start">
        <a className="btn btn-ghost text-base sm:text-xl font-bold text-red-500">💖 LoverTest.AI</a>
      </div>

      {/* Навигационные ссылки (Скрыты на мобильных) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-4 text-pink-600">
          <li><Link href="#main">Home</Link></li>
          <li><Link href="#why">Why analyze?</Link></li>
          <li><Link href="#price">Price</Link></li>
        </ul>
      </div>

      {/* Кнопка Upload */}
      <div className="navbar-end">
        <button className="btn bg-pink-500 text-white font-semibold hover:scale-105 hover:bg-red-500 transition-all px-4 py-2">
          Upload 💌
        </button>
      </div>
    </div>
  );
}
