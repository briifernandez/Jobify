import { StatusCodes } from 'http-status-codes'

//1. it is able to handle our database errors -mongoose
//2. there are also seperate controller errors

const errorHandlerMiddleware = (err,req,res,next) => {
    console.log(err)



    const defaultError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        //if err is present use it if not use generic
        msg: err.message || 'Something went wrong, try again later',
    }
    //err represents the whole object in postman, not the errors object inside it

    //ValidationError is the name property at the end, msg == err
    if(err.name === 'ValidationError'){
        defaultError.statusCode = StatusCodes.BAD_REQUEST
        // defaultError.msg = err.message //shows message from the bottom
        defaultError.msg = Object.values(err.errors)
        .map((item)=> item.message)
        .join(',')

    }

    if(err.code && err.code === 11000) {
        defaultError.statusCode = StatusCodes.BAD_REQUEST
        defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`

    }
    //shows whole err object with errors 


    //concise message
    res.status(defaultError.statusCode).json({msg: defaultError.msg})

    //email and password has to be unique
} 

export default errorHandlerMiddleware