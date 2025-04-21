const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// const initDB = async () => {
//   await Listing.deleteMany({});
//   initData.data= initData.data.map((obj)=>({...obj,//will come with previous data.listing object
//   owner:'67ac8588b32a29e83ec517d3'} ));//adding owner of that listing in it
//   await Listing.insertMany(initData.data);
// console.log("data was initialized");


// };
const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({ ...obj, owner: '67ac8588b32a29e83ec517d3' }));//we are inserting the data with default owner
  await Listing.insertMany(initData.data);
  console.log("data was initialized");

  // Accessing the owner property from the Listing collection
 
 
};






initDB();