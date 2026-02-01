const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connected to DB Successfully");
    } catch (error) {
        console.log("Database Connection Failed",error);
        process.exit(0);
    }
}

module.exports = connectDB;