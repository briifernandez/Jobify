import User from '../models/User.js'
import { StatusCodes } from 'http-status-codes'

const register = async (req, res) => {
        const {name,email,password} = req.body

        //if fields are empty
        if(!name || !email || !password) {
            throw new Error('please provide all values')
        }

        const user = await User.create({name, email, password})
        res.status(StatusCodes.CREATED).json({user})

        //adding next to parameters and below is good for error-handling with hard coded logic and can figure out if the error is mongoose or user with meaningful errors in postman
    
}
  
const login = async (req, res) => {
    res.send('login user')
}

const updateUser = async (req, res) => {
    res.send('updateUser user')
}


export { register, login, updateUser } 