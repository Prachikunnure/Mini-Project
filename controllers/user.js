const user=require("../models/user");

module.exports.renderSignUpForm=(req,res)=>
{
    res.render("users/signup.ejs");
}
module.exports.signup=async (req, res, next) => { // Added next parameter
        try {
            const { username, email, password } = req.body;
            const newUser = new user({ username, email });
            const registeredUser = await user.register(newUser, password);
            // console.log(registeredUser);
            req.login(registeredUser, (err) => {//when we signup then we will automatically make login();
                if (err) {
                    return next(err); // Use next for error handling
                }
                req.flash("success", "Welcome to Wanderlust!");
                res.redirect("/listing");
            });
        } catch (e) {
            req.flash("error", e.message);
            res.redirect("/signup");
        }
    }
module.exports.renderLoginForm=(req,res)=>
{
    res.render("users/login.ejs")
}
module.exports.loginForm= async(req,res)=>//when authentication get failed then redirect to login
{
req.flash("success","Welcome back to WanderLust!");
let redirect = res.locals.redirectUrl ||"/listing";//when from home page we login then it  will show page not found because there is no page to redirect.for that "/listing"
res.redirect(redirect);// when you fill the form of login  then you should go to the expected url.
}

// Logout
module.exports.logOut=(req,res)=>//generaly there could not be any error as such but when passport itself got err then it will throw err to next
{req.logout((err)=>//req.logout apne aap hi ak callback ko leta hai
{
    if(err)
    {
       return  next(err);
    }
    req.flash("success","you are logged out!");
    res.redirect("/listing");

})

}