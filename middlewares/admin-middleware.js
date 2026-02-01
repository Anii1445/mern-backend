const adminMiddleware = async (req, res, next) => {

   try {

    const isAdmin = req.user.isAdmin;
    // ----- Checking user is a Admin or Not ------ //
    if(!isAdmin){
        return res.status(400).json({ msg: "Access Denied, User is not an ADMIN"});
    }

    // -------- If user is an Admin proceed to next middleware or route handler -------- //
    next()

   } catch (error) {

    next(error);

   }


}

module.exports = adminMiddleware;