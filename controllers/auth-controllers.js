//In an Express.js application, a controller refers to a part of your code that is responsible for handling the application's logic.
//Controllers are typically used to process incoming requests, interacts with models (data sources), and send reponses back to client's
//They help organize your applications by seperating concerns and following the MVC design pattern.

//async is used to catch the errors.

const User = require("../models/user-model");
const home = async (req, res) => {
    try {
        res.status(200).send("Hello World");
    } catch (error) {
        console.log(error);
    }

};


// --------------------------
//      Register logic
// --------------------------

const register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const emailExist = await User.findOne({ email })
        
        if (emailExist) {
            return res.status(400).json({ msg: "Email already exist" });
        }

        const phoneExist = await User.findOne({ phone })

        if (phoneExist) {
            return res.status(400).json({ msg: "Phone already exist" });
        }

        const userCreated = await User.create({ name, email, phone, password });
        res.status(200).json({ msg: "Registration Successful!", 
                              token: await userCreated.generateToken(), 
                              userID: userCreated._id.toString() });

    } catch (error) {
        // res.status(400).send({ msg: "Page not found" });
        next(error);
    }
};


// ------------------------
//       Login logic
// ------------------------

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userExist = await User.findOne({ email });

        if (!userExist) {
            return res.status(400).json({ msg: "Invalid Credentials!" });
        }

        const isPassword = await userExist.comparePassword(password);

        if (isPassword) {
            res.status(200).json({ msg: "Login Successful!", token: await userExist.generateToken(), userID: userExist._id.toString(), role:userExist.isAdmin});
        }
        else{
            res.status(400).json({msg:"Invalid Email or Password"});
        }

    } catch (error) {
        //  res.status(500).json("Internal Server Error",error);
         next(error);
    }

}


//---------------- Verify token, authorized and get user data -------------------

const user = async (req, res) => {

    try {

        const userData = req.user;   // creating custom property req.user and req.token calling from auth-middleware.js
        const token = req.token;
        res.status(200).json(userData);

    } catch (error) {

        res.status(400).json(verified_error,"error");
        next(error);
    }

};

const getUserByID = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await User.findById(id);

        if(!response){
            res.status(400).json({msg: "Error"})
        }

        res.status(200).json(response)
    } catch (error) {
        res.status(500).json(error)
    }
}

const editUserData = async (req, res) => {
    try {
        const {id} = req.params;
        const allowedUpdates = (({ name, email, phone }) => ({ name, email, phone }))(req.body);

    // Check if email already exists (if user is trying to update it)
    if (allowedUpdates.email) {
      const userExist = await User.findOne({ email: allowedUpdates.email });
      if (userExist && userExist._id.toString() !== id) {
        return res.status(400).json({ msg: "Email already exists" });
      }
    }

        const response = await User.findByIdAndUpdate(
            id,
            { $set: allowedUpdates },
            { new: true })

            if(!response){
                res.status(400).json({msg: "error"})
            }   

            res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}


module.exports = { home, register, login, user, getUserByID, editUserData};