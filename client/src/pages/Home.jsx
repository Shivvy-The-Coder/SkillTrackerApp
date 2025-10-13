import React from 'react';
import Navbar from '../components/Navbar';
import Header from '../components/Header';
import { FaChartLine, FaCode, FaRocket, FaUsers, FaCheckCircle, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';



const Home = () => {
  const features = [
    {
      icon: <FaChartLine className="text-3xl text-purple-400" />,
      title: "Track Progress",
      description: "Monitor your learning journey with detailed analytics and insights"
    },
    {
      icon: <FaCode className="text-3xl text-blue-400" />,
      title: "Manage Skills",
      description: "Organize and categorize your technical and soft skills efficiently"
    },
    {
      icon: <FaRocket className="text-3xl text-pink-400" />,
      title: "Set Goals",
      description: "Define clear objectives and milestones for your career growth"
    },
    {
      icon: <FaUsers className="text-3xl text-green-400" />,
      title: "Share Profile",
      description: "Showcase your skills portfolio with employers and connections"
    }
  ];
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      text: "This platform helped me organize my learning path and land my dream job!",
      avatar: "SJ"
    },
    {
      name: "Mike Chen",
      role: "Data Scientist",
      text: "The best way to track my progress across multiple technologies.",
      avatar: "MC"
    },
    {
      name: "Emma Davis",
      role: "Full Stack Developer",
      text: "Simple, clean, and incredibly effective for career development.",
      avatar: "ED"
    }
  ];

  const navigate=useNavigate();

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-black overflow-hidden">
      
      {/* Subtle background elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 right-1/4 w-96 h-96 bg-purple-900/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full filter blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] bg-indigo-900/10 rounded-full filter blur-3xl"></div>
      </div>

      {/* Grain texture */}
      <div className="fixed inset-0 opacity-[0.015] pointer-events-none z-0" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
           }}>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        <Navbar />
        <Header/>

        {/* Features Section */}
        <section className="max-w-7xl mx-auto px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Master Your Skills</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A comprehensive platform designed to help you track, manage, and showcase your professional development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-[#2A2A3C] border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>


        {/* How It Works & Testimonials - Side by Side */}
        <section className="max-w-7xl mx-auto px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* How It Works - Left Column */}
            <div>
              <div className="mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Simple, Yet Powerful
                </h2>
                <p className="text-gray-400 text-lg">Get started in three easy steps</p>
              </div>

              <div className="space-y-6">
                {[
                  { step: "01", title: "Create Account", desc: "Sign up and set up your profile in minutes" },
                  { step: "02", title: "Add Your Skills", desc: "Track your proficiency and hours spent learning" },
                  { step: "03", title: "Monitor Growth", desc: "Watch your progress with analytics and insights" }
                ].map((item, index) => (
                  <div key={index} className="relative">
                    <div className="bg-[#2A2A3C] border border-gray-700 rounded-xl p-6 hover:border-purple-500/30 transition-all">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl font-bold text-purple-500/30 min-w-[60px]">{item.step}</div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                          <p className="text-gray-400">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                    {index < 2 && (
                      <div className="absolute left-8 -bottom-3 w-0.5 h-6 bg-gradient-to-b from-purple-500 to-transparent"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials - Right Column */}
            <div>
              <div className="mb-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Loved by Professionals
                </h2>
                <p className="text-gray-400 text-lg">See what our users have to say</p>
              </div>

              <div className="space-y-6">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-[#2A2A3C] border border-gray-700 rounded-xl p-6 hover:border-purple-500/30 transition-all">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-sm" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-5 italic">"{testimonial.text}"</p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold mr-4">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <div className="text-white font-semibold">{testimonial.name}</div>
                        <div className="text-gray-400 text-sm">{testimonial.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-8 py-20">
          <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Level Up Your Career?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who are tracking their skills and achieving their goals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
              onClick={()=>{navigate("/login")}}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg text-white font-semibold hover:opacity-90 transition cursor-pointer">
                Get Started Free
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-800 py-8">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 SkillTracker. All rights reserved @Shivam 
              </div>
              <div className="flex gap-6 text-gray-400 text-sm">
                <a href="#" className="hover:text-purple-400 transition">Privacy Policy</a>
                <a href="#" className="hover:text-purple-400 transition">Terms of Service</a>
                <a href="#" className="hover:text-purple-400 transition">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;