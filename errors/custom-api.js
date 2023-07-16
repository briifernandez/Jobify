class CustomAPIError extends Error {
    //there is an error constructor with a message argument MDN docs
    constructor(message){
        super(message)
       
    }
}

export default CustomAPIError