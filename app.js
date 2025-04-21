if(process.env.NODE_ENV != "production"){    //means we use our env file only in the dev phase ont in prood phase.
    require('dotenv').config()//now env file can be accessed at anywhere 
}
// console.log(process.env.SECRET) ;//for accessing .env file// in that accessing secret code

 require('dotenv').config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverriding = require("method-override");
const ejsMate = require("ejs-mate");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash= require("connect-flash");


const passport=require("passport");
const localstrategy=require("passport-local");
const user=require("./models/user.js");



 const path=require("path");
const Listing=require("./models/listing.js");
const WrapAsync=require("./utils/WrapAsync.js");
 const ExpressError = require("./utils/ExtendsError.js")
const { listingSchema ,reviewSchema} =require("./schema.js")
const Review = require("./models/review.js");


const listingsRouter = require("./routes/listing.js");
const reviewsRouter= require("./routes/review.js");
const userRouter= require("./routes/user.js");
// const WrapAsync = require("./utils/WrapAsync.js");

let AtlasDBURL= process.env.AtlasDBURL;//we have taken the DBurl from env which was created on the mongodb.altas.database where we store our database on internet
  // let mongoUrl="mongodb://127.0.0.1:27017/wanderlust";
  async function main()
  {
   await mongoose.connect(AtlasDBURL);
  }
  main()
  .then((res)=>
  {
      console.log("DataBase is connected");
  }).catch((err)=>
  {
      console.log("Error got occured in Database",err);
  });

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverriding("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


const store=MongoStore.create({
  mongoUrl:AtlasDBURL,
  crypto:{
 secret:process.env.SECRET,
  },
  touchAfter:24*3600
});

 store.on("error",(err)=>
    {
     console.log("Error in mongoSession Error",err);
    })
  
  // It simply gives kind of session duration to our server
  const sessionOptions={
     store,
      secret:process.env.SECRET,
      resave:false,
      saveUninitialized:true,
      cookie:{
        expires: Date.now()+7*24*60*60*1000,//when we add that miliseconds then it will add after one week's time 
        maxage:7*24*60*60*1000,
        http:true
      }
    }
 
app.use(session(sessionOptions));
app.use(flash());

// passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());//stores user related info
passport.deserializeUser(user.deserializeUser());//unstore user info

// using middleware  to give flash before its rendering the page which is in the /listings given below
// we will use this in index.ejs code bcz it will show over there
app.use((req,res,next)=>
  {
      res.locals.success= req.flash("success"),
      res.locals.error= req.flash("error"),//saving error msg at locals
      res.locals.currentuser = req.user;  //we cant directly access req.user in all templates then by using locals we can initialize
      next();
  });


//when we go to the listing route then we will use this 
 app.use("/listing",listingsRouter);
//  instead of writing reviews related crud operations will remove common parts like "/listing/:id/reviews"
 app.use("/listing/:id/reviews",reviewsRouter);
 app.use("/",userRouter);

// when in our domain we send req to wrong route then  for that
// for all *
app.all("*",(req,res,next)=>
{
    next(new ExpressError(404,"Page not found"));
});

app.use(( err,req,res,next )=>//catch error
{  let { statuscode = 500 , message ="Something Went wrong.."} = err;//can assign default values
res.status(statuscode).render("listings/error.ejs",{err});
// console.log(err);
});



app.listen(8080,(req,res)=>
{
    console.log("Server is started at port 8080");
});



// MIDDLEWARE PROCESS
// create middleware to handle error from WrapAsync function ,Expresserror function require