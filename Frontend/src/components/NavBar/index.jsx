import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-5">
      <div className="text-[32px] font-bold">
        <Link to="/">SolveMeUp</Link>
      </div>
      <div className="text-black visited:text-black">
        <Link to="/problems" className="px-[10px] hover:font-bold">문제</Link>
        <Link to="/ranking" className="px-[10px] hover:font-bold">랭킹</Link>
        <Link to="/archive" className="px-[10px] hover:font-bold">아카이브</Link>
        <Link to="/community" className="px-[10px] hover:font-bold">커뮤니티</Link>
      </div>
      <div>
        <Link to="/mypage" className=""><span class="material-symbols-outlined">account_circle</span></Link>
      </div>
    </nav>
  );
};

export default Navbar;