import mongoose from "mongoose";
import validator from "validator";
const UserSchema = new mongoose.Schema({
    name: {
        type: String, 
        required:[true, 'Please provide name'], 
        minlength: 3, 
        maxlength: 20,
        trim: true,
    },
    email: {
        type: String, 
        required:[true, 'Please provide email'], 
        validate: {
            validator: validator.isEmail,
            message:'Please provide a valid email'
        },
        //it is not a validator (this is using indexing) but ensures that the email has to be unique
        unique: true,

    },
    password: {
        type: String, 
        required:[true, 'Please provide password'], 
        //it is not a validator (this is using indexing) but ensures that the email has to be unique
        minlength: 6,

    },

    lastName: {
        type: String, 
        trim: true,
        maxlength: 20,
        default: 'lastName'
        
    },


    location: {
        type: String, 
        trim: true,
        maxlength: 20,
        default: 'my city'
        
    },


})

export default mongoose.model('User', UserSchema)