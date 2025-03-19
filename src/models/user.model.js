import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String, // DATATYPE OF FIELD
        maxLength: 30 // MAXIMUM LENGHT OF THE FIELD
    },
   
    lastName: {
        type: String
    },
    
    emailId: {
        type: String,
        lowercase: true, // LOWERCASING THE FIELD
        required: true, // REQUIRED FIELD
        unique: true, // UNIQUE FIELD
        trim: true, // TRIMS THE SPACES FROM THE FIELD
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid.");
            };
        }
    },
    
    password: {
        type: String,
        required: true,
        minLength: 6 // MINIMUM LENGHT OF FIELD
    },
    
    age: {
        type: Number,
        min: 18 // MINIMUM VALUE OF THE FIELD
    },
    
    gender: {
        type: String,
        validate(value) { // CHECKING FOR VALIDATION
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Gender is not valid");
            }
        }
    },
    
    photoUrl: {
        type: String
    },
    
    about: {
        type: String,
        default: "This is a default about of user." // DEFAULT VALUE OF THE FIELD
    },
    
    skills: {
        type: [String] // ARRAY OF STRNGS
    }
}, {
    timestamps: true
});

export const User = mongoose.model("User", userSchema);
