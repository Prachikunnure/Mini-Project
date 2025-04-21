const express =require("express");
const router = express.Router();  
const user=require("../models/user"); 
const WrapAsync = require("../utils/WrapAsync");
const passport=require("passport");
const {SaveRedirectUrl}=require("../middleware.js")
 const ExpressError = require("../utils/ExtendsError.js");

const userController=require("../controllers/user.js");

router
.route("/")
.get(userController.renderSignUpForm)
.post(
    WrapAsync(userController.signup)
);

router.route("/login")
.get(userController.renderLoginForm)
.post(
    SaveRedirectUrl,
    passport.authenticate("local",//authentiactions rituals
    {
    failureRedirect:"/login",
    failureFlash:true}),//here actual login is getting happened by the passport ,we are not doing this 
    userController.loginForm
   );



// get signup form
router.get("/signup",userController.renderSignUpForm);

// signup
router.post("/signup",
    WrapAsync(userController.signup)
);


//logout 
router.get("/logOut", userController.logOut);

module.exports=router;