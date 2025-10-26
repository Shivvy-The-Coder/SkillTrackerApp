// import React, { useContext, useState } from 'react';
// import Navbar from '../components/Navbar';
// import { assets } from '../assets/assets';
// import { useNavigate } from 'react-router-dom';
// import { AppContext } from '../context/AppContext';
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const Login = () => {
//   const navigate = useNavigate();
//   const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);

//   const [state, setState] = useState('Sign Up');
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const onSubmitHandler = async (e) => {
//     e.preventDefault();
//     try {
//       const endpoint = state === 'Sign Up' ? '/api/auth/register' : '/api/auth/login';
//       const payload = state === 'Sign Up' ? { name, email, password } : { email, password };

//       const { data } = await axios.post(backendUrl + endpoint, payload);

//       if (data.success) {
//         // Save token and set default Authorization header
//         localStorage.setItem('token', data.token);
//         axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

//         setIsLoggedin(true);
//         getUserData();
//         navigate('/');
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || error.message);
//     }
//   };

//   return (
//     <div className="relative flex items-center justify-center min-h-screen sm:px-0 bg-slate-950 overflow-hidden">
//       {/* 🎨 Animated Blurry Background */}
//       <div className="fixed inset-0 pointer-events-none z-0">
//         <div className="absolute top-14 right-4 w-12 h-12 bg-white mix-blend-multiply filter blur-xl opacity-40 animate-bounce"></div>
//         <div className="absolute -bottom-0 -left-0 w-56 h-56 bg-white mix-blend-multiply filter blur-md opacity-30 animate-bounce" style={{ animationDelay: '2s' }}></div>
//         <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white mix-blend-multiply filter blur-xl opacity-20 animate-bounce" style={{ animationDelay: '4s' }}></div>
//         <div className="absolute top-1 left-1 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white mix-blend-multiply filter blur-xl opacity-20 animate-bounce" style={{ animationDelay: '6s' }}></div>
//         <div className="absolute bottom-1 right-1 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white mix-blend-multiply filter blur-xl opacity-20 animate-bounce" style={{ animationDelay: '6s' }}></div>
//         <div className="absolute -bottom-1/2 right-1/3 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white mix-blend-multiply filter blur-xl opacity-20 animate-bounce" style={{ animationDelay: '6s' }}></div>
//       </div>

//       {/* Logo */}
//       <img
//         onClick={() => navigate('/')}
//         src={assets.Logo}
//         alt="log"
//         className="absolute left-5 sm:left-20 top-5 w-15 sm:w-15 cursor-pointer z-10"
//       />

//       {/* Form Card */}
//       <div className="z-10 bg-slate-900/80 backdrop-blur-md p-10 rounded-lg shadow-lg w-auto mx-2 sm:w-min text-indigo-400 text-sm">
//         <h2 className="text-3xl font-semibold text-white text-center mb-3">
//           {state === 'Sign Up' ? 'Create Account' : 'Login'}
//         </h2>
//         <p className="text-center text-sm mb-6">
//           {state === 'Sign Up' ? 'Create Your Account' : 'Login to Your Account'}
//         </p>

//         <form onSubmit={onSubmitHandler}>
//           {state === 'Sign Up' && (
//             <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
//               <img src={assets.person_icon} alt="" />
//               <input
//                 onChange={(e) => setName(e.target.value)}
//                 value={name}
//                 type="text"
//                 placeholder="Full Name"
//                 required
//                 className="bg-transparent outline-none text-gray-300"
//               />
//             </div>
//           )}

//           <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
//             <img src={assets.mail_icon} alt="" />
//             <input
//               onChange={(e) => setEmail(e.target.value)}
//               value={email}
//               type="email"
//               placeholder="Email Id"
//               required
//               className="bg-transparent outline-none text-gray-300"
//             />
//           </div>

//           <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
//             <img src={assets.lock_icon} alt="" />
//             <input
//               onChange={(e) => setPassword(e.target.value)}
//               value={password}
//               type="password"
//               placeholder="Password"
//               required
//               className="bg-transparent outline-none text-gray-300"
//             />
//           </div>

//           <p onClick={() => navigate('/reset-password')} className="mb-4 text-indigo-500 cursor-pointer">
//             Forgot password?
//           </p>

//           <button className="w-full py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white cursor-pointer font-medium">
//             {state}
//           </button>
//         </form>

//         {state === 'Sign Up' ? (
//           <p className="text-gray-400 text-center text-xs mt-4">
//             Already have an account?
//             <span onClick={() => setState('Login')} className="pl-1 text-blue-400 cursor-pointer underline">
//               Login here
//             </span>
//           </p>
//         ) : (
//           <p className="text-gray-400 text-center text-xs mt-4">
//             Don't have an account?
//             <span onClick={() => setState('Sign Up')} className="pl-1 text-blue-400 cursor-pointer underline">
//               Sign Up here
//             </span>
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Login;










import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContext);

  const [state, setState] = useState('Sign Up');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // 🌀 for loading animation

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const endpoint = state === 'Sign Up' ? '/api/auth/register' : '/api/auth/login';
      const payload = state === 'Sign Up' ? { name, email, password } : { email, password };

      const { data } = await axios.post(`${backendUrl}${endpoint}`, payload);

      if (data.success) {
        // ✅ Save token and set auth header instantly
        const token = data.token;
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // ✅ Start loading state
        toast.success(
          state === 'Sign Up'
            ? 'Account created successfully! Redirecting...'
            : 'Logged in successfully! Redirecting...'
        );
        setLoading(true);

        // ✅ Load user data and go to homepage
        await getUserData(token);
        setIsLoggedin(true);

        // Give spinner a small buffer before redirect
        setTimeout(() => {
          setLoading(false);
          navigate('/');
        }, 600);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      setLoading(false);
      toast.error(error.response?.data?.message || 'Something went wrong');
      console.error('Auth Error:', error);
    }
  };

  // 🌀 Simple loading spinner overlay
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white">
        <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin mb-4"></div>
        <p className="text-lg text-gray-300">Preparing your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen sm:px-0 bg-slate-950 overflow-hidden">
      {/* Background Blurry Animation (same as before) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-14 right-4 w-12 h-12 bg-white mix-blend-multiply filter blur-xl opacity-40 animate-bounce"></div>
        <div className="absolute -bottom-0 -left-0 w-56 h-56 bg-white mix-blend-multiply filter blur-md opacity-30 animate-bounce" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white mix-blend-multiply filter blur-xl opacity-20 animate-bounce" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-1 left-1 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white mix-blend-multiply filter blur-xl opacity-20 animate-bounce" style={{ animationDelay: '6s' }}></div>
        <div className="absolute bottom-1 right-1 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white mix-blend-multiply filter blur-xl opacity-20 animate-bounce" style={{ animationDelay: '6s' }}></div>
        <div className="absolute -bottom-1/2 right-1/3 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white mix-blend-multiply filter blur-xl opacity-20 animate-bounce" style={{ animationDelay: '6s' }}></div>
      </div>

      {/* Logo */}
      <img
        onClick={() => navigate('/')}
        src={assets.Logo}
        alt="log"
        className="absolute left-5 sm:left-20 top-5 w-15 sm:w-15 cursor-pointer z-10"
      />

      {/* Form */}
      <div className="z-10 bg-slate-900/80 backdrop-blur-md p-10 rounded-lg shadow-lg w-auto mx-2 sm:w-min text-indigo-400 text-sm">
        <h2 className="text-3xl font-semibold text-white text-center mb-3">
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </h2>

        <form onSubmit={onSubmitHandler}>
          {state === 'Sign Up' && (
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <img src={assets.person_icon} alt="" />
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Full Name"
                required
                className="bg-transparent outline-none text-gray-300"
              />
            </div>
          )}

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.mail_icon} alt="" />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Email Id"
              required
              className="bg-transparent outline-none text-gray-300"
            />
          </div>

          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <img src={assets.lock_icon} alt="" />
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Password"
              required
              className="bg-transparent outline-none text-gray-300"
            />
          </div>

          {state === 'Login' && (
            <p
              onClick={() => navigate('/reset-password')}
              className="mb-4 text-indigo-500 cursor-pointer"
            >
              Forgot password?
            </p>
          )}

          <button
            disabled={loading}
            className="w-full py-2.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white cursor-pointer font-medium disabled:opacity-50"
          >
            {state}
          </button>
        </form>

        {state === 'Sign Up' ? (
          <p className="text-gray-400 text-center text-xs mt-4">
            Already have an account?
            <span
              onClick={() => setState('Login')}
              className="pl-1 text-blue-400 cursor-pointer underline"
            >
              Login here
            </span>
          </p>
        ) : (
          <p className="text-gray-400 text-center text-xs mt-4">
            Don't have an account?
            <span
              onClick={() => setState('Sign Up')}
              className="pl-1 text-blue-400 cursor-pointer underline"
            >
              Sign Up here
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
