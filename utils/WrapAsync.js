//purpose of wrapclass is to not to crash the server when it happens any error
module.exports=(fn)=>
{
    return function(req,res,next)
    {
        fn(req,res,next).catch(next);//should pass that error to the middleware handling
        
    }
}