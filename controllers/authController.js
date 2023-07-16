import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError } from '../errors/index.js'

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
        res.status(StatusCodes.CREATED)
        .json({ 
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
    res.send('login user')
}

const updateUser = async (req, res) => {
    res.send('updateUser user')

}


export { register, login, updateUser } 