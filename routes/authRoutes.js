//first step
import express from 'express'
const router = express.Router()


import { register, login, updateUser } from '../controllers/authController.js'

//POST METHOD
router.route('/register').post(register)
router.route('/login').post(login)
//PATCH METHOD
router.route('/updateUser').patch(updateUser)

export default router