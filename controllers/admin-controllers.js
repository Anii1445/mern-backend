const User = require("../models/user-model");

const getAllUsers = async (req, res, next) => {
  try {
    const { name } = req.query;

    let filter = {};

    if (name) {
      filter = {
        $or: [
          { name: { $regex: name, $options: "i" } },
          { email: { $regex: name, $options: "i" } },
          { phone: { $regex: name, $options: "i" } },
        ],
      };
    }

    const userData = await User.find(filter).select("-password");

    if (!userData.length) {
      return res.status(404).json([]);
    }

    res.status(200).json(userData);
  } catch (error) {
    next(error);
  }
};


const deleteUser = async ( req, res) => {

    try {
        const id = req.params.id;
        const deleteUser = await User.deleteOne({_id: id});
        if(deleteUser){
            res.status(200).json({msg:"User Deleted Successfully!!"});
        }

    } catch (error) {
        next(error);
    }
}

module.exports = {getAllUsers, deleteUser};