// import React from 'react'
// import Navbar from '../components/Navbar';
// import Header from '../components/Header';

// const Home = () => {
//   return (
//     <div className='flex flex-col justify-center items-center min-h-screen bg-[url("/bg2.jpg")] bg-cover bg-center'>

//            <video
//         autoPlay
//         loop
//         muted
//         playsInline
//         className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
//       >
//         <source src="/bg-video.mp4" type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>

//       <Navbar/>
//       <Header/>
//     </div>
//   )
// }

// export default Home;

import React from 'react'
import Navbar from '../components/Navbar';
import Header from '../components/Header';

const Home = () => {
  return (
    <div className='relative flex flex-col justify-center items-center min-h-screen'>

      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
      >
        <source src="/bg-video1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Foreground content */}
      <Navbar />
      <Header />
      
    </div>
  );
}

export default Home;
