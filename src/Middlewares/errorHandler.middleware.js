const errorHandler = (error,req,res,next) => {
    
    // return catched errro
    res.status(error?.statusCode || error?.status || 500).json({
        message : error?.message || "Error: some thing wrong",
        statusCode : error?.statusCode || error?.status || 500,
        stack : error?.stack
    })

}
export default errorHandler;