// src/hooks/useAuth.js (예시)
import { useEffect, useState, useCallback } from "react";
import api from "@api/api";

export default function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  const refreshAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      await api.get("/api/auth/me");
      setIsAuthed(true);
    } catch {
      setIsAuthed(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  return { isLoading, isAuthed, setIsAuthed, refreshAuth };
}
