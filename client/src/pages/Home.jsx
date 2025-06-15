
import React from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';

const Home = () => {
  return (
    <div className="relative flex flex-col justify-center items-center min-h-screen bg-slate-950 overflow-hidden">

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-14 right-4 w-12 h-12 bg-white mix-blend-multiply filter blur-xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-0 -left-0 w-56 h-56 bg-white mix-blend-multiply filter blur-md opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1 left-1 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1 right-1 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-1/2 right-1/3 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Foreground content */}
      <Navbar />
      <Header />
    </div>
  );
};

export default Home;
