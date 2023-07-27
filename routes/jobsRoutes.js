//first step
import express from 'express'
const router = express.Router()

//controllers handle the logic to be sent 
import {
    createJob, 
    deleteJob, 
    getAllJobs, 
    updateJob, 
    showStats,
} from '../controllers/jobsController.js'



router.route('/').post(createJob).get(getAllJobs)
//remember about :id, stats must go first
router.route('/stats').get(showStats)
router.route('/:id').delete(deleteJob).patch(updateJob)
export default router