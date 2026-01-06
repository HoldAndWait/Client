import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center px-10">
      <div className="text-2xl font-black text-blue-600">
        <Link to="/">Omnicode</Link>
      </div>
      <div className="space-x-8 font-medium text-gray-700">
        <Link to="/" className="hover:text-blue-500 transition">홈</Link>
        <Link to="/community" className="hover:text-blue-500 transition">커뮤니티</Link>
        <Link to="/mypage" className="hover:text-blue-500 transition">마이페이지</Link>
      </div>
    </nav>
  );
};

export default Navbar;