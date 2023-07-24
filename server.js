import cors from 'cors'
import 'express-async-errors'
import express from 'express'
const app = express()
import dotenv from 'dotenv'
dotenv.config()

import morgan from 'morgan'

//db and autheticateUser
import connectDB from './db/connect.js'

//routers 
import authRouter from './routes/authRoutes.js'
import jobsRouter from './routes/jobsRoutes.js'
//middleware

import notFoundMiddleware from './middleware/not-found.js'
import errorHandlerMiddleware from './middleware/error-handler.js'

if(process.env.NODE_ENV != 'production') {
    app.use(morgan('dev'))
}

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
        //added
        process.exit(1);

    }
}

//invoke function
start()

//added
const shutdown = () => {
    console.log('Shutting down server gracefully...');
    if (server) {
      server.close(() => {
        console.log('Server has been gracefully closed.');
        process.exit(0); // Exit with a success code (0)
      });
    }
  };
  
  // Listen for the shutdown signals (SIGINT and SIGTERM)
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);



  //connectDB error handling
//   const start = async () => {
//     try {
//       await connectDB(process.env.MONGO_URL);
//       server = app.listen(port, () => {
//         console.log(`Server is listening on port ${port}...`);
//       });
//     } catch (error) {
//       console.log(error);
//       process.exit(1); // Exit with a non-zero status code (indicates an error)
//     }
//   };