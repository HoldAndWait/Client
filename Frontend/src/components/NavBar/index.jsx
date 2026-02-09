import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import api from "@api/api";
import useAuth from "@hooks/useAuth"; 

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoading, isAuthed, setIsAuthed } = useAuth();

  const logoutPath = import.meta.env.DEV ? "/api/dev/logout" : "/api/auth/logout";

  const onLogout = async () => {
    try {
      await api.post(logoutPath);
    } catch (e) {
      // 서버에서 이미 세션이 만료된 경우 등도 있을 수 있으니 UX상 그냥 로그아웃 처리해도 괜찮음
      console.error("logout failed:", e);
    } finally {
      setIsAuthed(false);      // 프론트 상태 즉시 반영
      navigate("/");           // 홈으로 이동
    }
  };

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

      <div className="flex items-center gap-3">
        
        {!isLoading && !isAuthed && (
          <Link to="/mypage" className="px-3 py-1 rounded hover:font-bold">
            로그인
          </Link>
        )}

        {!isLoading && isAuthed && (
          <>
            <Link to="/mypage" className="flex items-center">
              <span className="material-symbols-outlined">account_circle</span>
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="px-3 py-1 rounded hover:font-bold"
            >
              로그아웃
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;