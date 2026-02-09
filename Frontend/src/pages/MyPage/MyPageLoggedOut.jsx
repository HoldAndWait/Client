import React from "react";
import axios from "axios";
import api from "@api/api.js";

const MyPageLoggedOut = () => {

  const DEV_USER_ID = 1; 

  const handleGithubLogin = async () => {
    if (import.meta.env.DEV) {
      try {
        await api.post("/api/dev/login", null, { params: { userId: DEV_USER_ID } });
        window.location.href = "/";
      } catch (e) {
        console.error(e);
        alert("DEV 로그인 실패");
      }
      return;
    }

    window.location.href =
      `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_LOGIN_PATH}`;
  };


  return (
      <div className="flex min-h-screen bg-smu-base items-center justify-center p-10">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow p-8">
        <h1 className="flex justify-center text-3xl font-bold text-smu-navy mb-2">마이페이지</h1>
        <p className="text-smu-gray mb-6">
          마이페이지를 이용하려면 GitHub 로그인이 필요합니다.
        </p>

        <button
          onClick={handleGithubLogin}
          className="w-full py-3 rounded-xl font-bold bg-smu-black text-white hover:text-smu-neonlime transition"
        >
          GitHub 로그인
        </button>

        <button
          onClick={() => (window.location.href = "/")}
          className="w-full mt-3 py-3 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  )
}

export default MyPageLoggedOut;