import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuthMe } from "@api/auth";

export default function AuthCallbackPage() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        await getAuthMe();              // 로그인 성공 확인
        navigate("/", { replace: true });// 홈으로
      } catch (e) {
        console.error("Auth callback failed:", e);
        navigate("/", { replace: true }); // 로그인 페이지 없으면 일단 홈
        // 로그인 페이지가 있으면: navigate("/login", { replace: true });
      }
    })();
  }, [navigate]);

  return <div style={{ padding: 24 }}>로그인 처리 중...</div>;
}
