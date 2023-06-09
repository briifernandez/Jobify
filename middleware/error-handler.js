import { StatusCodes } from 'http-status-codes'

//1. it is able to handle our database errors -mongoose
//2. there are also seperate controller errors

const errorHandlerMiddleware = (err,req,res,next) => {
    //there is an error constructor with a message argument MDN docs
    console.log(err.message);
    const defaultError = {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
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
    res.status(defaultError.statusCode).json({msg: err})

    //concise message
    // res.status(defaultError.statusCode).json({msg: defaultError.msg})

    //email and password has to be unique
} 

export default errorHandlerMiddleware