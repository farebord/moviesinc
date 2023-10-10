import { useContext, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const { session, login, account, logout } = useContext(AuthContext);
  const isAuthenticated = useMemo(() => !!session, [session]);

  return { session, login, isAuthenticated, account, logout };
};
