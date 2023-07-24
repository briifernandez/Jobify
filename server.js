import cors from 'cors'
import 'express-async-errors'
import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()

//db and autheticateUser
import connectDB from './db/connect.js'

//routers 
import authRouter from './routes/authRoutes.js'
import jobsRouter from './routes/jobsRoutes.js'
//middleware

import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'


//makes json available to the controllers, middleware
app.use(express.json())


app.get('/',(req,res)=>{
    res.json({ msg: 'Welcome!'})
})
app.get('/api/v1',(req,res)=>{
    res.json({ msg: 'API'})
})

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', jobsRouter)


app.use(notFoundMiddleware) 
app.use(errorHandlerMiddleware)
const port = process.env.PORT || 4001




//only want to spin up server if connection was successful

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, ()=> {
            console.log(`Server is listening on port ${port}... `)

        });
        
    } 
    catch (error) {
        console.log(error)

    }
}

//invoke function
start()
