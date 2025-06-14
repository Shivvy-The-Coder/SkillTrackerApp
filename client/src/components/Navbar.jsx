// import React, { useContext } from 'react';
// import { assets } from '../assets/assets.js';
// import { useNavigate } from 'react-router-dom';
// import { AppContext } from '../context/AppContext.jsx';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const Navbar = () => {
//   const navigate = useNavigate();
//   const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContext);

//   const sendVerificationOtp = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const { data } = await axios.post(
//         `${backendUrl}/api/auth/send-verify-otp`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (data.success) {
//         navigate("/email-verify");
//         toast.success(data.message);
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const logout = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const { data } = await axios.post(
//         `${backendUrl}/api/auth/logout`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (data.success) {
//         localStorage.removeItem("token");
//         setIsLoggedin(false);
//         setUserData(false);
//         navigate('/');
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   return (
//     <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
//       <img src={assets.Logo} className="w-28 sm:w-28" alt="Logo" />

//       {userData ? (
//         <div className="w-8 h-8 flex justify-center items-center rounded-full bg-white text-black relative group cursor-pointer">
//           {userData.name[0].toUpperCase()}
//           <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
//             <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
//               {!userData.isAccountVerified && (
//                 <li
//                   onClick={sendVerificationOtp}
//                   className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
//                 >
//                   Verify Email
//                 </li>
//               )}
//               <li
//                 onClick={logout}
//                 className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
//               >
//                 Logout
//               </li>
//             </ul>
//           </div>
//         </div>
//       ) : (
//         <button
//           onClick={() => navigate('/login')}
//           className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-400 hover:bg-gray-100 transition-all"
//         >
//           Login
//           <img src={assets.arrow_icon} alt="Arrow" />
//         </button>
//       )}
//     </div>
//   );
// };

// export default Navbar;

import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets.js';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContext);
  const [showDropdown, setShowDropdown] = useState(false); // <-- new

  const toggleDropdown = () => setShowDropdown(prev => !prev);

  const sendVerificationOtp = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
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
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0">
      <img src={assets.Logo} className="w-28 sm:w-28" alt="Logo" />

      {userData ? (
        <div className="relative">
          <div
            onClick={toggleDropdown}
            className="w-8 h-8 flex justify-center items-center rounded-full bg-white text-black cursor-pointer"
          >
            {userData.name[0].toUpperCase()}
          </div>
          {showDropdown && (
            <div className="absolute top-10 right-0 z-10 text-black rounded bg-gray-100 text-sm shadow-md">
              <ul className="list-none m-0 p-2">
                {!userData.isAccountVerified && (
                  <li
                    onClick={() => {
                      sendVerificationOtp();
                      setShowDropdown(false);
                    }}
                    className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                  >
                    Verify Email
                  </li>
                )}
                <li
                  onClick={() => {
                    logout();
                    setShowDropdown(false);
                  }}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
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
          className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-400 hover:bg-gray-100 transition-all"
        >
          Login
          <img src={assets.arrow_icon} alt="Arrow" />
        </button>
      )}
    </div>
  );
};

export default Navbar;
