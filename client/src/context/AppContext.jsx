import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(false);

  const getAuthState = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedin(false);
      setUserData(false);
      return; // ⛔ Stop here — don’t hit backend without a token
    }

    try {
      const { data } = await axios.post(
        backendUrl + "/api/auth/is-auth",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setIsLoggedin(true);
        getUserData(token);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Auth check error: " + error.message);
    }
  };

  const getUserData = async (tokenParam) => {
    const token = tokenParam || localStorage.getItem("token");

    try {
      const { data } = await axios.get(backendUrl + "/api/user/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      data.success
        ? setUserData(data.userData)
        : toast.error(data.message);
    } catch (error) {
      toast.error("User data fetch error: " + error.message);
    }
  };

  // ✅ Only check auth if token already exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) getAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
