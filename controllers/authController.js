import User from '../models/User.js'

const register = async (req, res, next) => {
   
        const user = await User.create(req.body)
        res.status(201).json({user})

        //adding next to parameters and below is good for error-handling with hard coded logic and can figure out if the error is mongoose or user with meaningful errors in postman
    
}
  
const login = async (req, res) => {
    res.send('login user')
}

const updateUser = async (req, res) => {
    res.send('updateUser user')
}


export { register, login, updateUser } 