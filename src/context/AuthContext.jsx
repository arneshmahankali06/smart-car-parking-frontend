import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name  = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const role  = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    if (token && name && role) {
      setUser({ token, name, email, role, userId: Number(userId) });
    }
    setLoading(false);
  }, []);

  const loginUser = (data) => {
    localStorage.setItem("token",  data.token);
    localStorage.setItem("name",   data.name);
    localStorage.setItem("email",  data.email);
    localStorage.setItem("role",   data.role);
    localStorage.setItem("userId", data.userId);
    setUser(data);
  };

  const logoutUser = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
