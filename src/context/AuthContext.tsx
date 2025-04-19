// AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  use,
} from "react";
import { AuthContextType } from "../utils/types";
import { BASE_URL } from "../utils/backend-conf";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);



  useEffect(() => {
    const user = localStorage.getItem("useralldata");

    if (user && JSON.parse(user).role === "Admin") {
     setIsAdmin(true);
    }
  }
  , [isLoggedIn]);




  // Check initial auth state
  useEffect(() => {
    async function getDataFromApi() {
      const tokenExpired = isTokenExpired();

      if (!tokenExpired) {
        setIsLoggedIn(true);
      } else {
        await getValidToken();

        const newTokenExpired = isTokenExpired();
        if (!newTokenExpired) setIsLoggedIn(true);
      }
    }
    getDataFromApi();
  }, []);

  // Function to refresh token
  const refreshToken = useCallback(async () => {
    setIsRefreshing(true);

    const refreshToken = localStorage.getItem("refreshToken");
    const token = localStorage.getItem("accessToken");

    const response = await fetch(`${BASE_URL}/api/account/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refreshToken,
        token,
      }),
    });

    const data: {
      token: string;
      refreshToken: string;
      tokenExpiration: string;
    } = await response.json();

    localStorage.setItem("accessToken", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("tokenExpiration", data.tokenExpiration);
    setIsRefreshing(false);
    return data.token;
    /*
    setIsRefreshing(true);
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const token = localStorage.getItem("accessToken");
      if (!refreshToken) throw new Error("No refresh token available");

      const response = await fetch(`${BASE_URL}/api/account/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken,
          token,
        }),
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("tokenExpiration", data.tokenExpiration.toString());
      return data.token;
    } catch (error) {
      logout();
      throw error;
    } finally {
      setIsRefreshing(false);
    }*/
  }, []);

  // Function to check if token is expired
  const isTokenExpired = useCallback(() => {
    const expiration = localStorage.getItem("tokenExpiration");

    const isExpired = !expiration || new Date(expiration) <= new Date();
    return isExpired;
  }, []);

  // Function to get valid token (refreshes if needed)
  const getValidToken = useCallback(async () => {
    if (isTokenExpired()) {
      return await refreshToken();
    }
    return localStorage.getItem("accessToken");
  }, [isTokenExpired, refreshToken]);

  const login = () => {
    setIsLoggedIn(true);
  };


  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenExpiration");
    localStorage.removeItem("useralldata");
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        refreshToken,
        getValidToken,
        isRefreshing,
        isAdmin,
        setIsAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
