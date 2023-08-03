import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, UnAuthenticatedError } from '../errors/index.js'

const register = async (req, res) => {
        const {name,email,password} = req.body

        //if fields are empty
        if(!name || !email || !password) {
            throw new BadRequestError ('please provide all values')
        }

        const userAlreadyExists = await User.findOne({email});
        if (userAlreadyExists){
            throw new BadRequestError('Email already in use')
        }
        
        const user = await User.create({name, email, password})

        //JWT we are able to invoke the function from User.js
        const token = user.createJWT()
        res.status(StatusCodes.CREATED).json({ 
            user: {
            email:user.email, 
            lastName:user.lastName,
            location: user.location, 
            name:user.name 
            }, 
            token, 
            location: user.location 
        })

}    
//adding next to parameters and below is good for error-handling with hard coded logic and can figure out if the error is mongoose or user with meaningful errors in postman
    
  
const login = async (req, res) => {
    //if email and password is missing throw error
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError('Please provide all values')
    }

    //since password was select false that means we would not get that property in our response
    //find the user with the email, overides the select and gets password
    const user = await User.findOne({ email }).select('+password')

    //if user does not exist throw unauth error
    if(!user) {
        throw new UnAuthenticatedError('Invalid Credentials')
    }


    const isPasswordCorrect = await user.comparePassword(password)
    //if password is incorrect throw error
    if(!isPasswordCorrect) {
        throw new UnAuthenticatedError('Invalid Credentials')
    }

    const token = user.createJWT()
    //removes password from response
    user.password = undefined

    res.status(StatusCodes.OK).json({ user, token, location:user.location})
}

const updateUser = async (req, res) => {
    const { email, name, lastName, location } = req.body
    if (!email || !name || !lastName || !location) {
        throw new BadRequestError('Please provide all values')
    }
    const user = await User.findOne({_id:req.user.userId});

    //once we get the user now we update fields with new req.body

    user.email = email
    user.name = name
    user.lastName = lastName
    user.location = location

    await user.save()

    const token = user.createJWT()
    res.status(StatusCodes.OK).json({ user, token, location:user.location})

}


export { register, login, updateUser } 