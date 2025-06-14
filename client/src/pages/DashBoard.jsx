import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext.jsx';

const Dashboard = () => {
  const { backendUrl, userData, getUserData } = useContext(AppContext);

  // Personal Info states
  const [bio, setBio] = useState('');
  const [goals, setGoals] = useState('');
  const [showPersonalInfoForm, setShowPersonalInfoForm] = useState(false);

  // Skills states
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: '', proficiency: '', hoursSpent: '' });
  const [editingSkill, setEditingSkill] = useState(null);
  const [editSkillData, setEditSkillData] = useState({ name: '', proficiency: '', hoursSpent: '' });

  // Fetch personal info and skills
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

  useEffect(() => {
    fetchData();
  }, []);

  // Update personal info
  const updatePersonalInfo = async () => {
    try {
      const { data } = await axios.put(`${backendUrl}/api/user/personal-info`, { bio, goals });
      if (data.success) {
        toast.success('Personal info updated!');
        getUserData();
        setShowPersonalInfoForm(false); // Hide form after successful update
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Error updating personal info.', error.message);
    }
  };

  // Add new skill
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

  // Delete skill
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

  // Update skill
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

  // Start editing a skill
  const startEditingSkill = (skill) => {
    setEditingSkill(skill._id);
    setEditSkillData({
      name: skill.name,
      proficiency: skill.proficiency,
      hoursSpent: skill.hoursSpent,
    });
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingSkill(null);
    setEditSkillData({ name: '', proficiency: '', hoursSpent: '' });
  };

  return (
    // bg-gradient-to-br from-blue-50 via-white to-purple-50
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Welcome Header with User Info */}

        <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/40 to-pink-500/70 rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-2xl sm:text-3xl font-bold">
                    {userData?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-2 text-shadow-md text-shadow-amber-400">
                  Welcome, {userData?.name || 'User'}
                </h1>
                <div className="flex items-center justify-center sm:justify-start text-gray-100 mb-1">
                  <span className="w-4 h-4 mr-2">📧</span>
                  <span className="text-sm sm:text-base">{userData?.email || 'user@example.com'}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Dashboard • Last updated today
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 sm:space-x-6">
              <div className="text-center bg-blue-50 p-3 sm:p-4 rounded-xl">
                <div className="text-xl sm:text-2xl font-bold text-blue-600">{skills.length}</div>
                <div className="text-xs sm:text-sm text-gray-500">Skills</div>
              </div>
              <div className="text-center bg-green-50 p-3 sm:p-4 rounded-xl">
                <div className="text-xl sm:text-2xl font-bold text-green-600">
                  {skills.reduce((total, skill) => total + parseInt(skill.hoursSpent || 0), 0)}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Hours</div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Personal Information Display */}
        <div className="bg-white/10 rounded-2xl shadow-xl p-6 sm:p-8 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center mb-4 sm:mb-0">
              <span className="w-6 h-6 mr-3 text-blue-600">👤</span>
              Personal Information
            </h2>
            <button
              onClick={() => setShowPersonalInfoForm(!showPersonalInfoForm)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                showPersonalInfoForm
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
              }`}
            >
              {showPersonalInfoForm ? '❌ Cancel Edit' : '✏️ Edit Info'}
            </button>
          </div>

          {/* Current Info Display */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 rounded-xl border border-blue-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="mr-2">📝</span>
                Bio
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {bio || (
                  <span className="text-gray-400 italic">
                    No bio added yet. Click "Edit Info" to add your bio.
                  </span>
                )}
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 rounded-xl border border-green-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="mr-2">🎯</span>
                Goals
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {goals || (
                  <span className="text-gray-400 italic">
                    No goals set yet. Click "Edit Info" to add your goals.
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Collapsible Edit Form */}
          <div className={`mt-6 transition-all duration-500 ease-in-out ${
            showPersonalInfoForm ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 sm:p-6 rounded-xl border border-purple-100">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <span className="mr-2">✏️</span>
                Update Personal Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Bio</label>
                  <textarea
                    className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white hover:bg-gray-50"
                    rows="4"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Goals</label>
                  <textarea
                    className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white hover:bg-gray-50"
                    rows="3"
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    placeholder="What are your learning goals?"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    onClick={updatePersonalInfo}
                  >
                    💾 Save Changes
                  </button>
                  <button
                    className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                    onClick={() => setShowPersonalInfoForm(false)}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-gray-200 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-6 h-6 mr-3 text-green-600">🏆</span>
            Skills Management
          </h2>

          {/* Add New Skill Form */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 sm:p-6 rounded-xl mb-8 border border-green-100">
            <h3 className="font-semibold text-gray-800 mb-4">Add New Skill</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Skill Name"
                className="border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Proficiency Level"
                className="border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
                value={newSkill.proficiency}
                onChange={(e) => setNewSkill({ ...newSkill, proficiency: e.target.value })}
              />
              <input
                type="number"
                placeholder="Hours Spent"
                className="border-2 border-gray-200 p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white"
                value={newSkill.hoursSpent}
                onChange={(e) => setNewSkill({ ...newSkill, hoursSpent: Number(e.target.value) })}
              />
              <button
                className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={addSkill}
              >
                Add Skill
              </button>
            </div>
          </div>

          {/* Skills List */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {skills.map((skill) => (
              <div
                key={skill._id}
                className="group border-2 border-gray-200 p-4 sm:p-6 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-gray-50"
              >
                {editingSkill === skill._id ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editSkillData.name}
                      onChange={(e) => setEditSkillData({ ...editSkillData, name: e.target.value })}
                      className="w-full p-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Skill name"
                    />
                    <input
                      type="text"
                      value={editSkillData.proficiency}
                      onChange={(e) =>
                        setEditSkillData({ ...editSkillData, proficiency: e.target.value })
                      }
                      className="w-full p-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Proficiency level"
                    />
                    <input
                      type="number"
                      value={editSkillData.hoursSpent}
                      onChange={(e) =>
                        setEditSkillData({ ...editSkillData, hoursSpent: Number(e.target.value) })
                      }
                      className="w-full p-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Hours spent"
                    />
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => updateSkill(skill._id)}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200"
                      >
                        ✅ Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-200"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-lg text-gray-900 break-words">{skill.name}</h4>
                      <div className="flex space-x-1 sm:space-x-2 ml-2">
                        <button
                          onClick={() => startEditingSkill(skill)}
                          className="opacity-0 group-hover:opacity-100 text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-all duration-200"
                          title="Edit skill"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => deleteSkill(skill._id)}
                          className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                          title="Delete skill"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Proficiency:</span>
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {skill.proficiency}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600">Hours:</span>
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {skill.hoursSpent}h
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {skills.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl sm:text-6xl mb-4">📝</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No skills added yet</h3>
              <p className="text-gray-500">Start by adding your first skill above!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;