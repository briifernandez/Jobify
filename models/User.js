import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
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
        select: false,

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

//this is a middleware function for mongoose
//before we save the document, we want to run some functionality
//will get triggered in 2 instances - User.create and one in update user
//this does NOT work if you use User.findOneAndUpdate
UserSchema.pre('save', async function () {
    // console.log(this.modifiedPaths())
    //if i am not modifying the password field
    if(!this.isModified('password')) return
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    
})

//JWT
//everytime john makes a request on the frontend , the request will have a token
UserSchema.methods.createJWT = function() {
    return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_LIFETIME })

}

UserSchema.methods.comparePassword = async function(candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch
}
export default mongoose.model('User', UserSchema)