// for creating the user model first we need to create the schema ...

import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    name      : {type : String , required : true},
    email     : {type :String , required:true , unique : true},
    password  : {type:String , required:true },

    // below will contain the default values adn generally used for verification process, this will automatically added for any new user
    verifyOtp : {type:String , default:''},
    verifyOtpExpireAt : {type:Number , default:0},
    isAccountVerified : {type:Boolean , default:false},
    resetOTP : {type:String , default:''},
    resetOtpExpireAt : {type:Number , default:0},
});

// herr we will not export  userSchema becuase theis schema is being used by model;

// here it will search for the model user , gain and  again , and if and only if it is not present then only it will create the new model
const userModel = mongoose.models.user || mongoose.model('user', userSchema);

export default userModel;