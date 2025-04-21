const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportlocalMongoose=require("passport-local-mongoose");


const userSchema=new Schema({
    email:{
        type:String,
        required:true
    }
});
userSchema.plugin(passportlocalMongoose);//will crete id email password automatically
module.exports=mongoose.model("User",userSchema);