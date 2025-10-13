import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import { FaCircleArrowLeft } from "react-icons/fa6";

const proficiencyLabels = {
  1: "Beginner",
  2: "Novice",
  3: "Intermediate",
  4: "Advanced",
  5: "Expert",
};

const Dashboard = () => {
  const { backendUrl, userData, getUserData } = useContext(AppContext);
  const [bio, setBio] = useState("");
  const [goals, setGoals] = useState("");
  const [showPersonalInfoForm, setShowPersonalInfoForm] = useState(false);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ name: "", proficiency: 1, hoursSpent: "" });
  const [editingSkill, setEditingSkill] = useState(null);
  const [editSkillData, setEditSkillData] = useState({ name: "", proficiency: 1, hoursSpent: "" });
  const navigate = useNavigate();

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const { data } = await axios.get(`${backendUrl}/api/user/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (data.success) {
        setBio(data.userData.bio || "");
        setGoals(data.userData.goals || "");
        setSkills(
          (data.userData.skills || []).map((s) => ({
            ...s,
            hoursSpent: Number(s.hoursSpent || 0),
            proficiency: Number(s.proficiency || 1),
          }))
        );
      }
    } catch (error) {
      toast.error("Error fetching data",error);
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
        toast.success("Personal info updated!");
        getUserData(token);
        setShowPersonalInfoForm(false);
        fetchData();
      }
    } catch {
      toast.error("Error updating personal info");
    }
  };

  const addSkill = async () => {
    if (!newSkill.name || newSkill.hoursSpent === "") return toast.warn("Please fill all fields");
    const token = localStorage.getItem("token");
    if (!token) return toast.error("You are not logged in");
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/skill/add`,
        newSkill,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Skill added!");
        setNewSkill({ name: "", proficiency: 1, hoursSpent: "" });
        fetchData();
      }
    } catch {
      toast.error("Error adding skill");
    }
  };

  const deleteSkill = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("You are not logged in");
    try {
      const { data } = await axios.delete(`${backendUrl}/api/skill/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.success) {
        toast.success("Skill deleted!");
        fetchData();
      }
    } catch {
      toast.error("Error deleting skill");
    }
  };

  const updateSkill = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return toast.error("You are not logged in");
    try {
      const { data } = await axios.put(
        `${backendUrl}/api/skill/update/${id}`,
        editSkillData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success("Skill updated!");
        setEditingSkill(null);
        fetchData();
      }
    } catch {
      toast.error("Error updating skill");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalHours = skills.reduce((a, b) => a + b.hoursSpent, 0);
  const avgHours = skills.length > 0 ? Math.round(totalHours / skills.length) : 0;
  const topSkill = skills.reduce(
    (max, s) => (s.hoursSpent > (max?.hoursSpent || 0) ? s : max),
    {}
  );

  return (
    <div className="min-h-screen bg-[#1E1E2E] text-gray-200">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-lg font-semibold text-white">
            {userData?.name?.charAt(0) || "U"}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-white">Dashboard</h1>
            <p className="text-sm text-gray-400">
              Welcome back, <span className="font-medium text-white">{userData?.name}</span>
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-md text-white hover:opacity-90 transition"
        >
          <FaCircleArrowLeft /> Home
        </button>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 space-y-6">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {[{ label: "Total Skills", value: skills.length },
            { label: "Total Hours", value: `${totalHours}h` },
            { label: "Avg Hours/Skill", value: `${avgHours}h` }].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                className="bg-[#2A2A3C] p-5 rounded-lg border border-gray-700 shadow-sm hover:shadow-md transition"
              >
                <div className="text-sm text-gray-400">{stat.label}</div>
                <div className="text-2xl font-semibold text-white mt-1">{stat.value}</div>
              </motion.div>
            ))}
        </motion.div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-[#2A2A3C] border border-gray-700 rounded-lg p-5">
              <div className="flex justify-between mb-3">
                <h3 className="text-lg font-medium text-white">Profile</h3>
                <button
                  onClick={() => setShowPersonalInfoForm(!showPersonalInfoForm)}
                  className="text-sm text-purple-400 hover:underline"
                >
                  {showPersonalInfoForm ? "Close" : "Edit"}
                </button>
              </div>
              <p className="text-gray-400 text-sm">Bio: {bio || "—"}</p>
              <p className="text-gray-400 text-sm mt-2">Goals: {goals || "—"}</p>

              {showPersonalInfoForm && (
                <div className="mt-4 space-y-3">
                  <textarea
                    className="w-full p-2 rounded-md bg-[#1E1E2E] border border-gray-600 text-gray-200"
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Write bio..."
                  />
                  <textarea
                    className="w-full p-2 rounded-md bg-[#1E1E2E] border border-gray-600 text-gray-200"
                    rows={2}
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    placeholder="Set goals..."
                  />
                  <button
                    onClick={updatePersonalInfo}
                    className="w-full py-2 bg-gradient-to-r from-purple-600 to-blue-500 rounded-md text-white hover:opacity-90 transition"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            <div className="bg-[#2A2A3C] border border-gray-700 rounded-lg p-5">
              <h4 className="text-md font-medium text-white mb-2">Top Skill</h4>
              {topSkill?.name ? (
                <div>
                  <div className="text-gray-300">{topSkill.name}</div>
                  <div className="text-sm text-gray-400 mt-1">
                    {proficiencyLabels[topSkill.proficiency]} • {topSkill.hoursSpent}h
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 text-sm">No skills yet</div>
              )}
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Add Skill */}
            <div className="bg-[#2A2A3C] border border-gray-700 rounded-lg p-5">
              <h3 className="text-lg font-medium text-white mb-4">Add New Skill</h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Skill Name"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  className="p-2 rounded-md bg-[#1E1E2E] border border-gray-600 text-gray-200"
                />
                <select
                  value={newSkill.proficiency}
                  onChange={(e) =>
                    setNewSkill({ ...newSkill, proficiency: Number(e.target.value) })
                  }
                  className="p-2 rounded-md bg-[#1E1E2E] border border-gray-600 text-gray-200"
                >
                  {Object.entries(proficiencyLabels).map(([val, label]) => (
                    <option key={val} value={val}>
                      {val} — {label}
                    </option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="Hours Spent"
                  value={newSkill.hoursSpent}
                  onChange={(e) => setNewSkill({ ...newSkill, hoursSpent: e.target.value })}
                  className="p-2 rounded-md bg-[#1E1E2E] border border-gray-600 text-gray-200"
                />
                <button
                  onClick={addSkill}
                  className="bg-gradient-to-r from-purple-600 to-blue-500 text-white rounded-md hover:opacity-90 transition"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Skill List */}
            <div className="bg-[#2A2A3C] border border-gray-700 rounded-lg p-5">
              <h3 className="text-lg font-medium text-white mb-3">Your Skills</h3>
              {skills.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No skills added yet</div>
              ) : (
                <div className="space-y-3">
                  {skills.map((skill) => (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      key={skill._id}
                      className="flex items-center justify-between p-3 bg-[#1E1E2E] rounded-md border border-gray-700"
                    >
                      {editingSkill === skill._id ? (
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 w-full">
                          <input
                            type="text"
                            value={editSkillData.name}
                            onChange={(e) =>
                              setEditSkillData({ ...editSkillData, name: e.target.value })
                            }
                            className="p-2 rounded-md bg-[#2A2A3C] border border-gray-600 text-gray-200"
                          />
                          <select
                            value={editSkillData.proficiency}
                            onChange={(e) =>
                              setEditSkillData({
                                ...editSkillData,
                                proficiency: Number(e.target.value),
                              })
                            }
                            className="p-2 rounded-md bg-[#2A2A3C] border border-gray-600 text-gray-200"
                          >
                            {Object.entries(proficiencyLabels).map(([val, label]) => (
                              <option key={val} value={val}>
                                {val} — {label}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            value={editSkillData.hoursSpent}
                            onChange={(e) =>
                              setEditSkillData({ ...editSkillData, hoursSpent: e.target.value })
                            }
                            className="p-2 rounded-md bg-[#2A2A3C] border border-gray-600 text-gray-200"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateSkill(skill._id)}
                              className="px-3 py-2 bg-purple-600 text-white rounded-md"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingSkill(null)}
                              className="px-3 py-2 border border-gray-500 rounded-md text-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <div className="font-medium text-white">{skill.name}</div>
                            <div className="text-sm text-gray-400">
                              {proficiencyLabels[skill.proficiency]} • {skill.hoursSpent}h
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <button
                              onClick={() => {
                                setEditingSkill(skill._id);
                                setEditSkillData(skill);
                              }}
                              className="text-sm text-blue-400 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteSkill(skill._id)}
                              className="text-sm text-red-400 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
