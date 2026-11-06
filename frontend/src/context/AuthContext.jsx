import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore login session after page refresh
  useEffect(() => {

    const checkSession = async () => {

      try {

        const response = await api.get("/auth/me");

        setUser(response.data.user);

      } catch {
        setUser(null);

      } finally {
        setLoading(false);
      }

    };

    checkSession();

  }, []);

  const login = async (email, password) => {

    const response = await api.post("/auth/login", {
      email,
      password
    });

    setUser(response.data.user);

    return response.data;

  };

  const register = async (formData, role = "customer") => {

    const endpoint = role === "seller"
      ? "/auth/register-seller"
      : "/auth/register";

    const response = await api.post(endpoint, formData);

    setUser(response.data.user);

    return response.data;

  };

  const logout = async () => {

    try {

      await api.post("/auth/logout");

    } finally {

      setUser(null);

    }

  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );

}

export function useAuth() {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;

}