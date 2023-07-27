//first step
import express from 'express'
const router = express.Router()
import { register, login, updateUser } from '../controllers/authController.js'
import authenticateUser from '../middleware/auth.js'
//POST METHOD, public
router.route('/register').post(register)
router.route('/login').post(login)
//PATCH METHOD, restricted
router.route('/updateUser').patch(authenticateUser, updateUser)

export default router