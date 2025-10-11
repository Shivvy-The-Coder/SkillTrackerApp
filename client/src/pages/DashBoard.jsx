import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaClock, FaTrophy, FaChartLine, FaBook, FaStar, FaFire } from "react-icons/fa";
import { BiSolidEdit } from "react-icons/bi";
import { MdDelete, MdCheckCircle } from "react-icons/md";
// ;;

const proficiencyLevels = [
  { value: 1, label: 'Novice', color: 'from-red-500 to-orange-500', badge: 'bg-red-500' },
  { value: 2, label: 'Beginner', color: 'from-orange-500 to-amber-500', badge: 'bg-orange-500' },
  { value: 3, label: 'Intermediate', color: 'from-amber-500 to-yellow-500', badge: 'bg-yellow-500' },
  { value: 4, label: 'Advanced', color: 'from-lime-500 to-emerald-500', badge: 'bg-lime-500' },
  { value: 5, label: 'Expert', color: 'from-emerald-500 to-cyan-500', badge: 'bg-emerald-500' }
];

const Dashboard = () => {
  const { backendUrl, userData, getUserData } = useContext(AppContext);
  const [bio, setBio] = useState('');
  const [goals, setGoals] = useState('');
  const [showPersonalInfoForm, setShowPersonalInfoForm] = useState(false);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: '', proficiency: 1, hoursSpent: '' });
  const [editingSkill, setEditingSkill] = useState(null);
  const [editSkillData, setEditSkillData] = useState({ name: '', proficiency: 1, hoursSpent: '' });

  const navigate = useNavigate();

  // Fetch user data
  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("You are not logged in");
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        setBio(data.userData.bio || '');
        setGoals(data.userData.goals || '');
        setSkills(data.userData.skills || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error fetching data: ' + error.message);
    }
  };

  const updatePersonalInfo = async () => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("You are not logged in");
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/user/personal-info`,
        { bio, goals },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success('Personal info updated!');
        getUserData(token);
        setShowPersonalInfoForm(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error updating personal info: ' + error.message);
    }
  };

  const addSkill = async () => {
    if (!newSkill.name || !newSkill.hoursSpent) {
      return toast.warn('Fill all skill fields.');
    }
    const token = localStorage.getItem("token");
    if (!token) return toast.error("You are not logged in");
    try {
      const { data } = await axios.post(`${backendUrl}/api/skill/add`, newSkill, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success('Skill added!');
        setNewSkill({ name: '', proficiency: 1, hoursSpent: '' });
        fetchData();
      } else toast.error(data.message);
    } catch (error) {
      toast.error('Error adding skill: ' + error.message);
    }
  };

  const deleteSkill = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("You are not logged in");
    try {
      const { data } = await axios.delete(`${backendUrl}/api/skill/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success('Skill deleted!');
        fetchData();
      }
      else toast.error(data.message);
    } catch (error) {
      toast.error('Error deleting skill: ' + error.message);
    }
  };

  const updateSkill = async (id) => {
    if (!editSkillData.name || !editSkillData.hoursSpent) return toast.warn('Fill all fields.');
    const token = localStorage.getItem("token");
    if (!token) return toast.error("You are not logged in");
    try {
      const { data } = await axios.put(`${backendUrl}/api/skill/update/${id}`, editSkillData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        toast.success('Skill updated!');
        setEditingSkill(null);
        setEditSkillData({ name: '', proficiency: 1, hoursSpent: '' });
        fetchData();
      } else toast.error(data.message);
    } catch (error) {
      toast.error('Error updating skill: ' + error.message);
    }
  };

  const startEditingSkill = (skill) => {
    setEditingSkill(skill._id);
    setEditSkillData({ name: skill.name, proficiency: skill.proficiency, hoursSpent: skill.hoursSpent });
  };

  const cancelEditing = () => {
    setEditingSkill(null);
    setEditSkillData({ name: '', proficiency: 1, hoursSpent: '' });
  };

  useEffect(() => { fetchData(); }, []);

  const totalHours = skills.reduce((total, skill) => total + parseInt(skill.hoursSpent || 0), 0);
  const avgHours = skills.length > 0 ? Math.round(totalHours / skills.length) : 0;
  const topSkill = skills.reduce((max, skill) => parseInt(skill.hoursSpent || 0) > parseInt(max.hoursSpent || 0) ? skill : max, skills[0] || {});

  const getProficiencyData = (level) => {
    return proficiencyLevels.find(l => l.value === level) || proficiencyLevels[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-5 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-slate-800/90 via-gray-800/90 to-slate-800/90 backdrop-blur-xl shadow-2xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate('/')} 
                className="group w-12 h-12 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 border border-slate-600/50"
              >
                <FaArrowLeft className="text-xl text-slate-300 group-hover:text-cyan-400 transition-colors" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-xl">
                    <span className="text-white font-bold text-xl">
                      {userData?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    {userData?.name || 'User'}'s Dashboard
                  </h1>
                  <p className="text-slate-400 text-sm">{userData?.email}</p>
                </div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-3">
              <div className="px-4 py-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl border border-cyan-500/30">
                <p className="text-sm text-cyan-400 font-medium">Level: Pro</p>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-xl border border-orange-500/30">
                <FaFire className="text-orange-400" />
                <span className="text-sm text-orange-400 font-medium">7 Day Streak</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Skills Card */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                  <FaBook className="text-2xl text-white" />
                </div>
                <FaStar className="text-cyan-400 text-xl" />
              </div>
              <p className="text-slate-400 text-sm mb-1">Total Skills</p>
              <p className="text-3xl font-bold text-white">{skills.length}</p>
              <div className="mt-3 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" style={{width: '75%'}}></div>
              </div>
            </div>
          </div>

          {/* Total Hours Card */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                  <FaClock className="text-2xl text-white" />
                </div>
                <FaFire className="text-emerald-400 text-xl" />
              </div>
              <p className="text-slate-400 text-sm mb-1">Total Hours</p>
              <p className="text-3xl font-bold text-white">{totalHours}<span className="text-lg text-slate-400">h</span></p>
              <p className="text-xs text-emerald-400 mt-2">+12h this week</p>
            </div>
          </div>

          {/* Average Hours Card */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300 hover:scale-105 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                  <FaChartLine className="text-2xl text-white" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-purple-400">↑ 15%</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-1">Avg Hours/Skill</p>
              <p className="text-3xl font-bold text-white">{avgHours}<span className="text-lg text-slate-400">h</span></p>
              <p className="text-xs text-slate-500 mt-2">Performance: Excellent</p>
            </div>
          </div>

          {/* Top Skill Card */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300"></div>
            <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700/50 hover:border-amber-500/50 transition-all duration-300 hover:scale-105 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
                  <FaTrophy className="text-2xl text-white" />
                </div>
                <MdCheckCircle className="text-amber-400 text-2xl" />
              </div>
              <p className="text-slate-400 text-sm mb-1">Top Skill</p>
              <p className="text-xl font-bold text-white truncate">{topSkill?.name || 'N/A'}</p>
              {topSkill?.hoursSpent && (
                <p className="text-xs text-amber-400 mt-2">{topSkill.hoursSpent}h practiced</p>
              )}
            </div>
          </div>
        </div>

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Info */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 px-6 py-5 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white flex items-center">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse"></span>
                    Profile
                  </h2>
                  <button 
                    onClick={() => setShowPersonalInfoForm(!showPersonalInfoForm)} 
                    className="px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-sm font-medium transition-all border border-cyan-500/30"
                  >
                    {showPersonalInfoForm ? 'Cancel' : 'Edit'}
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Bio Section */}
                <div className="group">
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                    <div className="relative bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-4 border border-slate-600/50">
                      <div className="flex items-center mb-2">
                        <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2"></div>
                        <p className="text-sm font-semibold text-cyan-400">Bio</p>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {bio || 'No bio added yet. Tell us about yourself!'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Goals Section */}
                <div className="group">
                  <div className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                    <div className="relative bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-xl p-4 border border-slate-600/50">
                      <div className="flex items-center mb-2">
                        <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2"></div>
                        <p className="text-sm font-semibold text-emerald-400">Goals</p>
                      </div>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {goals || 'No goals set yet. What do you want to achieve?'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Edit Form */}
                {showPersonalInfoForm && (
                  <div className="pt-4 border-t border-slate-700/50 space-y-4 animate-fadeIn">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Bio</label>
                      <textarea 
                        value={bio} 
                        onChange={(e) => setBio(e.target.value)} 
                        placeholder="Tell us about yourself..." 
                        rows={3}
                        className="w-full p-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">Goals</label>
                      <textarea 
                        value={goals} 
                        onChange={(e) => setGoals(e.target.value)} 
                        placeholder="What are your goals..." 
                        rows={2}
                        className="w-full p-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <button 
                      onClick={updatePersonalInfo} 
                      className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl text-white font-medium transition-all shadow-lg hover:shadow-cyan-500/50"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Skills Management */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 px-6 py-5 border-b border-slate-700/50">
                <h2 className="text-xl font-bold text-white flex items-center">
                  <span className="w-2 h-2 bg-purple-400 rounded-full mr-3 animate-pulse"></span>
                  Skills Management
                </h2>
              </div>
              
              {/* Add Skill */}
              <div className="p-6 bg-gradient-to-br from-slate-700/30 to-slate-800/30 border-b border-slate-700/50">
                <h4 className="text-sm font-semibold text-slate-400 mb-4 flex items-center">
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2"></div>
                  Add New Skill
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <input 
                    type="text" 
                    placeholder="Skill Name" 
                    value={newSkill.name} 
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })} 
                    className="px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  />
                  <select 
                    value={newSkill.proficiency} 
                    onChange={(e) => setNewSkill({ ...newSkill, proficiency: Number(e.target.value) })} 
                    className="px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  >
                    {proficiencyLevels.map(level => (
                      <option key={level.value} value={level.value} className="bg-slate-800">
                        {level.label}
                      </option>
                    ))}
                  </select>
                  <input 
                    type="number" 
                    placeholder="Hours Spent" 
                    value={newSkill.hoursSpent} 
                    onChange={(e) => setNewSkill({ ...newSkill, hoursSpent: Number(e.target.value) })} 
                    className="px-4 py-3 rounded-xl bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  />
                  <button 
                    onClick={addSkill} 
                    className="py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium transition-all shadow-lg hover:shadow-cyan-500/50"
                  >
                    Add Skill
                  </button>
                </div>
              </div>

              {/* Skills List */}
              <div className="p-6">
                {skills.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center shadow-xl">
                      <FaBook className="text-5xl text-slate-600" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No skills added yet</h3>
                    <p className="text-slate-400">Start building your skill portfolio!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {skills.map(skill => {
                      const profData = getProficiencyData(skill.proficiency);
                      const maxHours = Math.max(...skills.map(s => s.hoursSpent || 1));
                      const percentage = (skill.hoursSpent / maxHours) * 100;
                      
                      return (
                        <div key={skill._id} className="group relative">
                          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-300"></div>
                          <div className="relative bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-2xl p-5 border border-slate-600/50 hover:border-slate-500/50 transition-all">
                            {editingSkill === skill._id ? (
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                <input 
                                  type="text" 
                                  value={editSkillData.name} 
                                  onChange={(e) => setEditSkillData({ ...editSkillData, name: e.target.value })} 
                                  className="px-4 py-2 rounded-xl bg-slate-700/70 border border-slate-600/50 text-white focus:ring-2 focus:ring-cyan-500 transition-all"
                                />
                                <select 
                                  value={editSkillData.proficiency} 
                                  onChange={(e) => setEditSkillData({ ...editSkillData, proficiency: Number(e.target.value) })} 
                                  className="px-4 py-2 rounded-xl bg-slate-700/70 border border-slate-600/50 text-white focus:ring-2 focus:ring-cyan-500 transition-all"
                                >
                                  {proficiencyLevels.map(level => (
                                    <option key={level.value} value={level.value} className="bg-slate-800">
                                      {level.label}
                                    </option>
                                  ))}
                                </select>
                                <input 
                                  type="number" 
                                  value={editSkillData.hoursSpent} 
                                  onChange={(e) => setEditSkillData({ ...editSkillData, hoursSpent: Number(e.target.value) })} 
                                  className="px-4 py-2 rounded-xl bg-slate-700/70 border border-slate-600/50 text-white focus:ring-2 focus:ring-cyan-500 transition-all"
                                />
                                <div className="flex space-x-2">
                                  <button 
                                    onClick={() => updateSkill(skill._id)} 
                                    className="flex-1 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 rounded-xl text-white text-sm font-medium transition-all shadow-md"
                                  >
                                    Save
                                  </button>
                                  <button 
                                    onClick={cancelEditing} 
                                    className="flex-1 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition-all"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                                  <div className="flex items-center space-x-4 flex-1">
                                    <div className={`w-14 h-14 bg-gradient-to-br ${profData.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                                      <span className="text-white font-bold text-xl">
                                        {skill.name.charAt(0).toUpperCase()}
                                      </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-lg font-bold text-white mb-1 truncate">{skill.name}</h4>
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium ${profData.badge} text-white shadow-sm`}>
                                          {profData.label}
                                        </span>
                                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sm">
                                          <FaClock className="mr-1" />
                                          {skill.hoursSpent}h
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <button 
                                      onClick={() => startEditingSkill(skill)} 
                                      className="flex items-center space-x-1 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-lg text-sm font-medium border border-cyan-500/30 transition-all"
                                    >
                                      <BiSolidEdit className="text-lg" />
                                      <span>Edit</span>
                                    </button>
                                    <button 
                                      onClick={() => deleteSkill(skill._id)} 
                                      className="flex items-center space-x-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg text-sm font-medium border border-red-500/30 transition-all"
                                    >
                                      <MdDelete className="text-lg" />
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                </div>
                                
                                {/* Progress Bar */}
                                <div className="w-full">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs text-slate-400">Progress</span>
                                    <span className="text-xs text-cyan-400 font-medium">{Math.round(percentage)}%</span>
                                  </div>
                                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                                    <div 
                                      className={`h-full bg-gradient-to-r ${profData.color} rounded-full transition-all duration-500`}
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;