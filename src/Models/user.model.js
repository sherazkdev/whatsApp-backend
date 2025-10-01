import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// Schema for users
const UserSchema = new mongoose.Schema({
    fullname : {
        type: String,
    },
    username : {
        type:String,
        unique:true,
    },
    email : {
        type:String,
        unique:true,
        required:true,
    },
    phoneNumber : {
        type:String,
        unique:true,
    },
    avatar : {
        type:String,
        default:null,
    },
    coverImage : {
        type:String,
    },
    about: {
        type:String,
        default:"Hey there! I’m using WhatsApp."
    },
    lastSeen : {
        type: Date,
    },
    isOnline: { 
        type: Boolean,
        default: false
    },
    refreshToken: {
        type:String,
    },
    isVerified : {
        type:Boolean,
        default:false,
    },
    status : {
        type:String,
        enum:["ENABLED","DISABLE"],
        default:"DISABLE"
    },    
    blockedUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    otp: {
        type:String,
        default:null
    },
    otpExpiry:{
        type:Date,
        default:null
    }
},{timestamps:true});

// adding some methods
UserSchema.pre("save",async function (next) {
    
    try {
        if(!this.isModified("otp")) {
            return next();
        }
        const salt = await bcrypt.genSalt(10);
        const hashedOtp = await bcrypt.hash(this.otp,salt);
        this.otp = hashedOtp;
        next();
        
    } catch (error) {
        next(error);
    }
});

UserSchema.pre("findOneAndUpdate",async function (next) {
    
    try {
        const updatedUserDocument = this.getUpdate();

        if(updatedUserDocument?.$set && updatedUserDocument.$set?.otp){
            const salt = await bcrypt.genSalt(10);
            updatedUserDocument.$set.otp = await bcrypt.hash(updatedUserDocument?.$set?.otp,salt);
            this.setUpdate(updatedUserDocument);
        }
        next();
    } catch (error) {
        next(error);
    }
});

UserSchema.methods.genrateAccessToken = function () {
    try {
        const payload = {
            _id:this._id,
            fullname:this.fullname,
            email:this.email,
            usernamename:this.username,
            phoneNumber:this.phoneNumber,
            avatar:this.avatar,
            coverImage:this.coverImage,
        };
        const genratingHashedToken = jwt.sign(payload,process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY});
        return genratingHashedToken;
    } catch (error) {
        return error;
    }
}

UserSchema.methods.verifyHashedOtp = async function (otp) {
    try {
        const compareOtp = await bcrypt.compare(otp,this.otp);
        return compareOtp;
    } catch (error) {
        return error;
    }
};

UserSchema.methods.genrateRefreshToken = function () {
    try {
        const payload = {
            _id:this._id,
        };
        const refreshToken = jwt.sign(payload,process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY});
        return refreshToken;
    } catch (error) {
        return error;
    }
}
// Model
const UserModel = mongoose.model("User",UserSchema);

export default UserModel;