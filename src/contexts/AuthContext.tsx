import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

type UserInfo = {
  id?: number;
  username?: string;
  email?: string;
};

type AuthContextValue = {
  token: string | null;
  user: UserInfo | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function decodeJwt(token: string): UserInfo | null {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    const obj = JSON.parse(decodeURIComponent(escape(json)));
    // common claim names: sub, email, username, name
    return {
      id: obj?.sub || obj?.id || undefined,
      email: obj?.email || obj?.username || undefined,
      username: obj?.username || obj?.name || undefined,
    };
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [user, setUser] = useState<UserInfo | null>(() => {
    const t = localStorage.getItem("token");
    return t ? decodeJwt(t) : null;
  });

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    const u = decodeJwt(newToken);
    setUser(u);
    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete api.defaults.headers.common["Authorization"];
  };

  useEffect(() => {
    if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    else delete api.defaults.headers.common["Authorization"];
  }, [token]);

  return <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
