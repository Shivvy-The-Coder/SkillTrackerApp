import mongoose from "mongoose";

const personalInfoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bio: { type: String, default: '' },
  goals: { type: String, default: '' },
});


const PersonalInfo = mongoose.model("PersonalInfo", personalInfoSchema);

export default PersonalInfo;
