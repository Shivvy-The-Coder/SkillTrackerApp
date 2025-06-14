import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true; // ✅ Enables sending cookies

export const AppContextProvider = ({ children }) => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Check if user is authenticated
  const getAuthState = async () => {
    try {
      const { data } = await axios.post("/api/auth/is-auth");
      if (data.success) {
        setIsLoggedin(true);
        getUserData();
      } else {
        setIsLoggedin(false);
        setUser(null);
      }
    } catch (err) {
      console.log("Auth check error:", err?.response?.data?.message || err.message);
      setIsLoggedin(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get logged-in user data
  const getUserData = async () => {
    try {
      const { data } = await axios.get("/api/user/data");
      setUser(data.user);
    } catch (err) {
      console.log("User fetch error:", err?.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);

  return (
    <AppContext.Provider
      value={{
        isLoggedin,
        setIsLoggedin,
        user,
        setUser,
        getUserData,
        loading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
