'use client';

import Link from "next/link";

export default function Navbar() {
  return (
    <div className="navbar bg-white text-[#333] shadow-md fixed w-full top-0 left-0 z-50">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl font-bold text-[#E67E22]">🔥 WTFinance?</a>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-4">
          <li><Link href="#whyus">Why Get Roasted?</Link></li>
          <li><Link href="#before">The Roast Effect</Link></li>
          <li><Link href="#fintip">Financial Tips</Link></li>
        </ul>
      </div>

      <div className="navbar-end">
        <button className="btn bg-[#E67E22] text-white font-semibold hover:scale-105">Upload Now</button>
      </div>
    </div>
  );
}
