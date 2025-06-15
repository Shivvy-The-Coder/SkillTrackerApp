import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { backendUrl, userData, getUserData } = useContext(AppContext);

  // States80
  const [bio, setBio] = useState('');8051
  const [goals, setGoals] = useState('');
  const [showPersonalInfoForm, setShowPersonalInfoForm] = useState(false);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: '', proficiency: '', hoursSpent: '' });
  const [editingSkill, setEditingSkill] = useState(null);
  const [editSkillData, setEditSkillData] = useState({ name: '', proficiency: '', hoursSpent: '' });

   const navigate = useNavigate();
  // API calls
  const fetchData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`);
      if (data.success) {
        setBio(data.userData.bio || '');
        setGoals(data.userData.goals || '');
        setSkills(data.userData.skills || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error fetching data.', error.message);
    }
  };

  const updatePersonalInfo = async () => {
    try {
      const { data } = await axios.put(`${backendUrl}/api/user/personal-info`, { bio, goals });
      if (data.success) {
        toast.success('Personal info updated!');
        getUserData();
        setShowPersonalInfoForm(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error updating personal info.', error.message);
    }
  };

  const addSkill = async () => {
    if (!newSkill.name || !newSkill.proficiency || !newSkill.hoursSpent) {
      return toast.warn('Fill all skill fields.');
    }

    try {
      const { data } = await axios.post(`${backendUrl}/api/skill/add`, newSkill);
      if (data.success) {
        toast.success('Skill added!');
        setNewSkill({ name: '', proficiency: '', hoursSpent: '' });
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error adding skill.', error.message);
    }
  };

  const deleteSkill = async (id) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/skill/delete/${id}`);
      if (data.success) {
        toast.success('Skill deleted!');
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error deleting skill.', error.message);
    }
  };

  const updateSkill = async (id) => {
    if (!editSkillData.name || !editSkillData.proficiency || !editSkillData.hoursSpent) {
      return toast.warn('Fill all skill fields.');
    }

    try {
      const { data } = await axios.put(`${backendUrl}/api/skill/update/${id}`, editSkillData);
      if (data.success) {
        toast.success('Skill updated!');
        setEditingSkill(null);
        setEditSkillData({ name: '', proficiency: '', hoursSpent: '' });
        fetchData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error updating skill.', error.message);
    }
  };

  const startEditingSkill = (skill) => {
    setEditingSkill(skill._id);
    setEditSkillData({ name: skill.name, proficiency: skill.proficiency, hoursSpent: skill.hoursSpent });
  };

  const cancelEditing = () => {
    setEditingSkill(null);
    setEditSkillData({ name: '', proficiency: '', hoursSpent: '' });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // here iw ill be calculating the dashbard data like skill count , total hours and avg time 
  const totalHours = skills.reduce((total, skill) => total + parseInt(skill.hoursSpent || 0), 0);
  const avgHours = skills.length > 0 ? Math.round(totalHours / skills.length) : 0;
  const topSkill = skills.reduce((max, skill) => parseInt(skill.hoursSpent || 0) > parseInt(max.hoursSpent || 0) ? skill : max, skills[0] || {});

  return (
    <div className="min-h-screen bg-black">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-14 right-4 w-12 h-12 bg-white  mix-blend-multiply filter blur-xl opacity-2=40 animate-bounce"></div>
        <div className="absolute -bottom-0 -left-0 w-56 h-56 bg-white  mix-blend-multiply filter blur-md opacity-30 animate-bounce animation-delay-2000"></div>
        <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white  mix-blend-multiply filter blur-xl opacity-20 animate-bounce "></div>
        <div className="absolute top-1 left-1 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white  mix-blend-multiply filter blur-xl opacity-20 animate-bounce "></div>
        <div className="absolute bottom-1 right-1 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-white  mix-blend-multiply filter blur-xl opacity-20 animate-bounce "></div>
        <div className="absolute -bottom-1/2 right-1/3 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white  mix-blend-multiply filter blur-xl opacity-20 animate-bounce "></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-slate-800/60 backdrop-blur-lg shadow-xl border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <div className="flex-shrink-0">
                {/* Profile Image Space */}
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {userData?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-800"></div>
                </div>
              </div>
              <div className="hidden md:block">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <p className="text-slate-300">
                  Welcome back, <span className='text-xl font-bold text-emerald-400'>{userData?.name || 'User'}</span>
                </p>
              </div>
            </div>
            
            {/* Header Action Space */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="w-10 h-10 bg-slate-700/50 backdrop-blur rounded-lg flex items-center justify-center hover:bg-slate-600/50 transition-colors cursor-pointer"
                  onClick={() => navigate('/')}>
                <span className="text-slate-300">⬅️</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 backdrop-blur-lg border border-cyan-500/30 overflow-hidden shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg">📚</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-400 truncate">Total Skills</dt>
                    <dd className="text-2xl font-bold text-white">{skills.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500/20 to-green-600/20 backdrop-blur-lg border border-emerald-500/30 overflow-hidden shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg">⏱️</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-400 truncate">Total Hours</dt>
                    <dd className="text-2xl font-bold text-white">{totalHours}h</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-violet-600/20 backdrop-blur-lg border border-purple-500/30 overflow-hidden shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg">📊</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-400 truncate">Avg Hours/Skill</dt>
                    <dd className="text-2xl font-bold text-white">{avgHours}h</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-500/20 to-rose-600/20 backdrop-blur-lg border border-pink-500/30 overflow-hidden shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-rose-500 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg">🏆</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-slate-400 truncate">Top Skill</dt>
                    <dd className="text-2xl font-bold text-white truncate">{topSkill.name || 'None'}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-1">
            <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 shadow-2xl rounded-2xl mb-6 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700/50">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Profile</h3>
                  <button
                    onClick={() => setShowPersonalInfoForm(!showPersonalInfoForm)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:shadow-lg"
                  >
                    {showPersonalInfoForm ? 'Cancel' : 'Edit'}
                  </button>
                </div>
              </div>
              
              <div className="px-6 py-6">
                {/* Profile Image Section */}
                <div className="flex items-center mb-6">
                  <div className="relative mr-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-xl">
                      <span className="text-white text-2xl font-bold">
                        {userData?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">{userData?.name || 'User'}</h4>
                    <p className="text-slate-400">{userData?.email || 'user@example.com'}</p>
                  </div>
                </div>

                {/* Bio Section */}
                <div className="mb-4 border border-slate-600/50 rounded-xl p-4 bg-slate-700/30">
                  <h5 className="text-lg font-semibold text-emerald-400 mb-2">Bio</h5>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {bio || 'No bio added yet. Tell us about yourself!'}
                  </p>
                </div>

                {/* Goals Section */}
                <div className="mb-4 border border-slate-600/50 rounded-xl p-4 bg-slate-700/30">
                  <h5 className="text-lg font-semibold text-cyan-400 mb-2">Goals</h5>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {goals || 'No goals set yet. What do you want to achieve?'}
                  </p>
                </div>

                {/* Edit Form */}
                {showPersonalInfoForm && (
                  <div className="mt-6 pt-6 border-t border-slate-700/50">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Bio</label>
                        <textarea
                          rows={3}
                          value={bio}
                          onChange={(e) => setBio(e.target.value)}
                          className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          placeholder="Tell us about yourself..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Goals</label>
                        <textarea
                          rows={2}
                          value={goals}
                          onChange={(e) => setGoals(e.target.value)}
                          className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                          placeholder="What are your learning goals?"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <button
                          onClick={updatePersonalInfo}
                          className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-lg"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setShowPersonalInfoForm(false)}
                          className="flex-1 bg-slate-600/50 text-slate-300 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-600 transition-all duration-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Skills Management */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 shadow-2xl rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700/50">
                <h3 className="text-xl font-bold text-white">Skills Management</h3>
              </div>
              
              {/* Add New Skill */}
              <div className="px-6 py-6 bg-slate-700/30 border-b border-slate-700/50">
                <h4 className="text-lg font-semibold text-purple-400 mb-4">Add New Skill</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                    type="text"
                    placeholder="Skill Name"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                  <input
                    type="text"
                    placeholder="Proficiency Level"
                    value={newSkill.proficiency}
                    onChange={(e) => setNewSkill({ ...newSkill, proficiency: e.target.value })}
                    className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                  <input
                    type="number"
                    placeholder="Hours Spent"
                    value={newSkill.hoursSpent}
                    onChange={(e) => setNewSkill({ ...newSkill, hoursSpent: Number(e.target.value) })}
                    className="px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                  <button
                    onClick={addSkill}
                    className="py-3 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
                  >
                    Add Skill
                  </button>
                </div>
              </div>

              {/* Skills List */}
              <div className="px-6 py-6">
                {skills.length === 0 ? (
                  <div className="text-center py-16">
                    {/* Empty State Image Space */}
                    <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center">
                      <div className="text-6xl opacity-50">📚</div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">No skills added yet</h3>
                    <p className="text-slate-400 text-lg">Start by adding your first skill above!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {skills.map((skill) => (
                      <div key={skill._id} className="border border-slate-600/50 rounded-2xl p-6 bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
                        {editingSkill === skill._id ? (
                          // Edit Mode
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <input
                              type="text"
                              value={editSkillData.name}
                              onChange={(e) => setEditSkillData({ ...editSkillData, name: e.target.value })}
                              className="px-4 py-3 bg-slate-600/50 border border-slate-500/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            />
                            <input
                              type="text"
                              value={editSkillData.proficiency}
                              onChange={(e) => setEditSkillData({ ...editSkillData, proficiency: e.target.value })}
                              className="px-4 py-3 bg-slate-600/50 border border-slate-500/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            />
                            <input
                              type="number"
                              value={editSkillData.hoursSpent}
                              onChange={(e) => setEditSkillData({ ...editSkillData, hoursSpent: Number(e.target.value) })}
                              className="px-4 py-3 bg-slate-600/50 border border-slate-500/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                            />
                            <div className="flex space-x-2">
                              <button
                                onClick={() => updateSkill(skill._id)}
                                className="flex-1 bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-lg"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="flex-1 bg-slate-600/50 text-slate-300 px-4 py-3 rounded-xl text-sm font-medium hover:bg-slate-600 transition-all duration-300"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <div className="flex items-center justify-between">
                            <div className="flex-grow">
                              <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                  {/* Skill Icon Space */}
                                  <div className="w-14 h-14 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-lg">
                                      {skill.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-grow">
                                  <h4 className="text-lg font-bold text-white mb-2">{skill.name}</h4>
                                  <div className="flex items-center space-x-3">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                      {skill.proficiency}
                                    </span>
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-300 border border-emerald-500/30">
                                      {skill.hoursSpent}h
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => startEditingSkill(skill)}
                                className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-purple-300 hover:text-purple-200 px-4 py-2 rounded-lg text-sm font-medium border border-purple-500/30 transition-all duration-300"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => deleteSkill(skill._id)}
                                className="bg-gradient-to-r from-red-500/20 to-rose-500/20 hover:from-red-500/30 hover:to-rose-500/30 text-red-300 hover:text-red-200 px-4 py-2 rounded-lg text-sm font-medium border border-red-500/30 transition-all duration-300"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Dashboard