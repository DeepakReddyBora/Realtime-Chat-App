import {
  createContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext =
  createContext();

function AuthProvider({
  children,
}) {
  const [authUser, setAuthUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // check auth
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get(
          "/auth/check"
        );

        setAuthUser(res.data);
      } catch {
        setAuthUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export {
  AuthContext,
  AuthProvider,
};