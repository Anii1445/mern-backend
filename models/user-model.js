const mangoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mangoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
         unique: true,   // 👈 HERE
         trim: true,
        require: true
    },
    phone: {
        type: String,
         unique: true,   // 👈 HERE
         trim: true,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

// secure the password with the bcrypt
userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified("password")) {
        next();
    }

    try {
        const saltRound = await bcrypt.genSalt(10);
        const hash_Password = await bcrypt.hash(user.password, saltRound);
        user.password = hash_Password;

    } catch (error) {
        console.log(error);
    }
});

// Generating JSON WEB TOKEN and using methods we can create many funtions and can be use it in controllers.
// Components of a JWT: Header, Payload, and Signature. 
const JWT_SECRET_KEY = "HELLOMYNAMEISANKITRAMJIGUPTA";

userSchema.methods.generateToken = async function () {
    try {
        return jwt.sign({
            userId: this._id.toString(),
            name: this.name,
            phone: this.phone,
            email: this.email, 
            isAdmin: this.isAdmin,
          },
            JWT_SECRET_KEY,
            {
                expiresIn: "30d",
            });

    } catch (error) {
        console.log(error);
    }
};

// Comparing user password with creating instance of comparepassword
userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};


// define the model name or collection name
const User = new mangoose.model("User", userSchema);
module.exports = User;
