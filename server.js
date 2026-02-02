const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const router = require("./router/auth-router");
const adminRoute = require("./router/admin-router");
const connectDB = require("./database/db")
const errorMiddleware = require("./middlewares/error-middleware")

/*------------------------------------------------------------------------------------------------------
   Mount the Router:  To use the router you have to mount or import it into main express file,
                      you can mount it at a specific URL prefix.
  ------------------------------------------------------------------------------------------------------*/

// ------------ Handling cors policy issues ----------- //
const corsOptions = {
    origin: ["http://localhost:5173","https://firstfitness.vercel.app"],
    methods: "GET, POST, DELETE, PUT, PATCH, HEAD",
    credentials: true
}

app.use(cors(corsOptions));
app.use(express.json());

// ------------- Let's define public route -------------------//
app.use("/api/auth/", router);

// ------------- Let's define admin route --------------------//
app.use("/api/admin/", adminRoute);

// ---- Middleware for handling all errors before connection ----//
app.use(errorMiddleware);              


// ---- DB Connection ---- //
connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on Port: ${process.env.PORT}`)
    })
})
