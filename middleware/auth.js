const auth = async(req, res, next) => {
    console.log('autheticate user')
    next()
}

export default auth