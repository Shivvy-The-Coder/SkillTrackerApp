// in this we will cerate differnt controller functions like register , login , logout etc

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import userModel from "../models/userModel.js";
import cookieParser from "cookie-parser";
import transporter from "../config/nodemailer.js";
import { response } from "express";

export const register = async (req,res)=>{
    const {name , email , password } = req.body;
     if(!name || !email || !password)
            {
                return res.json({success:false,message :"Missing Details"})
            }
     try
     {
            // before creating the new user we need to check wether the user already exist or what
            const exisitingUser = await userModel.findOne({email})
            if(exisitingUser)
                    {
                        return  res.json({success:false , message : "user already exisit"});
                    }
            // herer we will not store teh exact password , but we will be encrypting the passwprd
            const hashedPassword = await bcrypt.hash(password,10);
            
            // now as the user doesnot exist already in DB and all the required coloumn has been fileed , we willl create a new user using user model 
            const user = new userModel({name , email , password : hashedPassword});
            await user.save(); // saving the new user in database

            // now we are generating a jwt token for authentication purpose and we will send this token using cookies
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET , {expiresIn:'7d'});
            // this token for 7 days authentication has beenc reated and ow we will send this token using reaponse and in reposne we will add the cookie
            
            res.cookie('token', token, {
                    
                httpOnly : true , // therefore this will run only http
                secure :true,
                samesite:'None',
                maxAge:7*24*60*60*1000 //7days in millisecond this is the xpiry time for cookie
            });
            // sending welcome email
            try{
                const mailOptions ={
                from:process.env.SENDER_EMAIL,
                to:email,
                subject:'WELCOME TO Personal Tracker APP',
                text:`WElcome to Personal Tracking APP , Your Account has been created with email id :${email}`
                                    }
                await transporter.sendMail(mailOptions);
                
            }catch (mailErr) 
                {
                    console.error("Failed to send welcome email:", mailErr.message);
                }
            return res.json({success:true, message:"user has been created"})
     }
     catch(err)
     {
        res.json({success:false , message:err.message})
     } 
}

export const login = async(req, res)=>{
    const { email ,password} = req.body;
    if(!email || !password)
            {
                return res.json({success:false,message :"email and Password required"});
            }

            try
            {
                const user = await userModel.findOne({email});
                if(!user)
                        return res.json({success:false , message:"Invalid Email"});
                const isMatch = await bcrypt.compare(password, user.password);
                if(!isMatch)
                        return res.json({success:false , message : "Invalid Password"});
                 
                // henece the user name and password is checked is true , there fpr now we wil create an TOKEN 
                const token = jwt.sign({id:user._id} , process.env.JWT_SECRET , {expiresIn : '7d'});
                res.cookie('token', token, {                   
                httpOnly : true , // therefore this will run only http
                secure :true,
                samesite:'None',
                maxAge:7*24*60*60*1000 //7days in millisecond this is the xpiry time for cookie
            });
                return res.json({success:true})
            }
            catch(err)
                {
                    return res.json({success:false , message:"Error Occured while loggin in"})
                }
}


export const logout =async (req,res)=>{
    try
        {
            //herer we have to clear the cookie form the response 
            res.clearCookie('token',{
                httpOnly : true , // therefore this will run only http
                secure :process.env.NODE_ENV==='production',//?whenever  we will run this live server then it should run on https then it ill be true , and if runn locally then it should be dalse 
                samesite:process.env.NODE_ENV==='production'?'none':'strict',//?in local backedn and frontend runs on same enviroment so it willbe true , but wne live server we will run on differnt servers
            })
            return res.json({success:true , message:'Logged out'})
        }
    catch(err)
                {
                    return res.json({success:false , message:"Error Occured while loggin in"})
                }
}

// for verfication OTP

export const sendVerifyOtp = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId);    
    if (user.isAccountVerified)
      return res.json({ success: false, message: "Account already verified" });

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save();

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${otp}. Please verify your account using this OTP.`,
    };

    await transporter.sendMail(mailOptions);
    return res.json({ success: true, message: "Verification OTP has been sent" });

  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};


export const verifyEmail = async (req,res)=>{
    const { otp } = req.body;
    const userId = req.userId;
        if(!userId || !otp)
          return res.json({success:false , message:"Missing Details OTP/userID"}) ;
    try
    {
        const user = await userModel.findById(userId);
        if(!user)
               return  res.json({success:false , message:"user not found"})
        if(user.verifyOtp===''||user.verifyOtp!==otp)
            {
                return res.json({success:false , message:"Invalid OTP"})
            }
        if(user.verifyOtpExpireAt <Date.now())
            {
                return res.json({success:false , message:"OTP Expired"})
            }
        user.isAccountVerified=true;
        user.verifyOtp='';
        user.verifyOtpExpireAt=0;

        await user.save()

        return res.json({success:true , message:"EMail verified Succesfully"})
    }
    catch(err)
        {
            res.json({success:false, message:err.message});
        }
}

// check if user is already authenticated or not
// first the middleware will be executed then after that this controller funnciotn will  be executed
export const isAuthenticated =async(req,res)=>{
    try{
            return res.json({success:true , message:"User is Authenticated"});
    }
    catch(err)
        {
            res.json({success:false , message:err.message});
        }
}


// send password reset otp
export const sendResetOtp = async  (req,res)=>{
    const {email}= req.body;
    if (!email)
            return res.json({success:false , message:"Email is required"})
    try
    {
        const user = await userModel.findOne({email});
        if(!user) 
            return res.json({success:false  , message:"user not found"});
                // now suppose the usr is availanle with this email id , then we need to create an otp  and that will be saved in DB and sent on email
        const otp = String(Math.floor(100000 + Math.random() * 900000));
            user.resetOTP = otp;
            user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 24 hours

            await user.save();

            const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            text: `Your OTP for reseting password is ${otp}. Please verify your account using this OTP.`,
            };

    await transporter.sendMail(mailOptions);
    return res.json({success:true , message: "reset OTP has been sent"});
        
        console.log(isUser);
    }
    catch(err)
        {
            return res.json({success:false , message:err.message});
        }
}


export const resetPassword = async(req,res)=>{
    const {email, otp , newPassword} = req.body;

    if(!email || !otp || ! newPassword)
            {return res.json({success:false , message:"Email , OTP and new password required"});}
    try
    {
            const user = await userModel.findOne({email});
            if(!user)
                    {
                        res.json({success:false , message:"user not found"});
                    }
                if(user.resetOTP===""||user.resetOTP!==otp)
                        return res.json({success:false  , message:"Invalid OTP"});

                if(user.resetOtpExpireAt <Date.now())
                    return res.json({success:false , message:'OTP Expired'});
                const hashedPassword= await bcrypt.hash( newPassword, 10);
                user.password=hashedPassword;
                user.resetOTP='';
                user.resetOtpExpireAt=0;
                await user.save();

                return res.json({success:true , message:"password has been changed Succesfully"})
    }
    catch(err)
    {
        return res.json({success:false , message:err.message});
    }
}