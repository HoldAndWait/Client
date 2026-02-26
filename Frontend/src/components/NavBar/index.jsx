import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "@api/api";
import useAuth from "@hooks/useAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading, isAuthed, setIsAuthed } = useAuth();

  const logoutPath = import.meta.env.DEV ? "/api/dev/logout" : "/api/auth/logout";

  const onLogout = async () => {
    try {
      await api.post(logoutPath);
    } catch (e) {
      console.error("logout failed:", e);
    } finally {
      setIsAuthed(false);
      navigate("/");
    }
  };

  const isActive = (to) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <nav
      className="
        sticky top-0 z-50 w-full
        border-b border-gray-100
        bg-white/80 backdrop-blur
        text-smu-black
      "
    >
      <div className="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between gap-4">
        {/* ===== Brand ===== */}
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-[22px] font-extrabold tracking-tight"
          >
            SolveMeUp
          </Link>
          <span className="hidden md:inline text-sm text-smu-gray">
            Coding Practice Platform
          </span>
        </div>

        {/* ===== Center Nav ===== */}
        <div className="hidden md:flex items-center gap-1">
          {[
            { to: "/problems", label: "문제" },
            { to: "/ranking", label: "랭킹" },
            { to: "/archive", label: "아카이브" },
            { to: "/community", label: "커뮤니티" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`
                px-3 py-2 rounded-xl text-sm font-semibold transition
                ${
                  isActive(item.to)
                    ? "bg-smu-base text-smu-black"
                    : "text-smu-navy hover:bg-smu-base hover:text-smu-black"
                }
              `}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* ===== Auth Area ===== */}
        <div className="flex items-center gap-3">
          {!isLoading && !isAuthed && (
            <Link
              to="/mypage"
              className="
                px-4 py-2 rounded-2xl text-sm font-semibold transition
                bg-smu-neonlime
                text-smu-black
                hover:bg-smu-navy
                hover:text-smu-base
              "
            >
              로그인
            </Link>
          )}

          {!isLoading && isAuthed && (
            <>
              <Link
                to="/mypage"
                className="
                  inline-flex items-center justify-center
                  w-11 h-11 rounded-2xl
                  text-smu-navy
                  hover:bg-smu-base
                  transition
                "
              >
                <span className="material-symbols-outlined">
                  account_circle
                </span>
              </Link>

              <button
                type="button"
                onClick={onLogout}
                className="
                  px-4 py-2 rounded-2xl text-sm font-semibold transition
                  border border-gray-200
                  text-smu-navy
                  hover:border-smu-navy
                  hover:bg-smu-base
                "
              >
                로그아웃
              </button>
            </>
          )}
        </div>
      </div>

      {/* ===== Mobile Nav ===== */}
      <div className="md:hidden border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 py-2 flex items-center justify-between">
          {[
            { to: "/problems", label: "문제" },
            { to: "/ranking", label: "랭킹" },
            { to: "/archive", label: "아카이브" },
            { to: "/community", label: "커뮤니티" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`
                text-sm font-semibold px-2 py-2 rounded-xl transition
                ${
                  isActive(item.to)
                    ? "bg-smu-base text-smu-black"
                    : "text-smu-navy hover:bg-smu-base"
                }
              `}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;