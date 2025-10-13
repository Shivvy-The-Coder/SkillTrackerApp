import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContext);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => setShowDropdown(prev => !prev);

  const sendVerificationOtp = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        localStorage.removeItem("token");
        setIsLoggedin(false);
        setUserData(false);
        navigate('/');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="w-full flex justify-between items-center px-4 sm:px-6  fixed top-0 bg-black/50 z-50">
      <img src={assets.Logo} 
      className="w-18 sm:w-23 md:w-28" alt="Logo" />

      {userData ? (
        <div className="relative">
          {/* Avatar Button */}
          <div
            onClick={toggleDropdown}
            className="w-10 h-10 sm:w-10 sm:h-10 flex justify-center items-center rounded-full bg-white text-black cursor-pointer text-base sm:text-lg"
          >
            {userData.name[0].toUpperCase()}
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute top-12 right-0 z-10 text-black rounded bg-gray-100 text-sm shadow-md w-36 sm:w-40">
              <ul className="list-none m-0 p-2">
                {!userData.isAccountVerified && (
                  <li
                    onClick={() => {
                      sendVerificationOtp();
                      setShowDropdown(false);
                    }}
                    className="py-2 px-3 text-sm sm:text-base hover:bg-gray-200 cursor-pointer rounded"
                  >
                    Verify Email
                  </li>
                )}
                <li
                  onClick={() => {
                    logout();
                    setShowDropdown(false);
                  }}
                  className="py-2 px-3 text-sm sm:text-base hover:bg-gray-200 cursor-pointer rounded"
                >
                  Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 border border-gray-500 rounded-full px-4 sm:px-6 py-2 text-sm sm:text-base text-gray-400 hover:bg-gray-100 transition-all"
        >
          Login
          <img src={assets.arrow_icon} alt="Arrow" className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
