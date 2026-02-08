import { useEffect, useState } from "react";
import api from "@api/api";

export default function useAuth() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        await api.get("/api/auth/me");
        setIsAuthed(true);
      } catch {
        setIsAuthed(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return { isLoading, isAuthed };
}
