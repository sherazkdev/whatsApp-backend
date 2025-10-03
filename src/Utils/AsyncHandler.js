


const AsyncHandler = ( ...fns ) => {
    return fns.map( (fc) => (req,res,next) => Promise.resolve(fc(req,res,next)).catch( (error) => next(error) ))
}
export default AsyncHandler;
