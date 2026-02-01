

const { Cart, State, Cities, Address } = require("../models/cart-model");
const mongoose = require("mongoose");

const addCart = async (req, res) => {
    try {
        const{ user_id, product_id, variant_id, product_price, product_weight, product_flavour, product_mrp, product_qty, product_img } = req.body;
        const addTocart = await Cart.create({ user_id, product_id, variant_id, product_price, product_weight, product_flavour, product_mrp,product_qty, product_img });

        if(!addTocart){
            return res.status(404).json({msg:"Not added!"});
         }

        res.status(200).json(addTocart); 
        
    } catch (error) {
        console.log(error);
    }
}

const getCartByUser = async (req, res) => {
    const { id } = req.params;
    try {
        const response = await Cart.find({user_id: id});
        if(!response){
            return res.status(400).json({msg: "Not Found"});
        }
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
    }
}

const deleteCartByID = async( req, res ) => {
    try {
        const { _id, user_id } = req.body;
        const response = await Cart.findOneAndDelete({ _id, user_id });

        if(!response){
            return res.status(404).json({ msg: "Not Deleted!!"});
        }

        res.status(200).json({msg: "Deleted"});
    } catch (error) {
        console.log(error);
    }
}


const getState = async(req, res) => {
    try {
        const state = await State.find();
        if(state.length === 0)
        {
            return res.status(404).json({msg: "error"})
        }

        res.status(200).json(state)
    } catch (error) {
        console.log(error)
    }
}

const getCities = async(req, res) => {
    try {
        const city = await Cities.find();
        if(city.length === 0)
        {
            return res.status(404).json({msg: "error"})
        }

        res.status(200).json(city)
    } catch (error) {
     console.log(error)   
    }
}


const addUserAddress = async(req, res) => {
    try {
        const {user_id, full_name, phone, house_no, area, landmark, pincode, state, city, address_type } = req.body;
        const response = await Address.create({user_id, full_name, phone, house_no, area, landmark, pincode, state, city, address_type });

        if(!response){
            return res.status(404).json({msg: "Error"});
        }

        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}


const getJoinCartByUserID = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await Cart.aggregate([
      // 1️⃣ Match cart by user
      {
        $match: {
          user_id: id
        }
      },

      // 2️⃣ Convert product_id (string → ObjectId) if needed
      {
        $addFields: {
          productObjId: { $toObjectId: "$product_id" }
        }
      },

      // 3️⃣ Lookup product & variant
      {
        $lookup: {
          from: "products",
          localField: "productObjId",
          foreignField: "_id",
          as: "product"
        },
    },
        {
            $unwind: "$product"
        },
            // match product
            // match variant inside product
            {
              $addFields: {
                variant: {
                  $arrayElemAt: [
                    {
                        $filter: {
                            input: "$product.variant",
                            as: "v",
                            cond: { $eq: ["$$v._id","$variant_id"]}
                        }
                    },0
                  ]
                }
              }
           
    
      },
      // 4️⃣ Flatten arrays
    //   { $unwind: "$product.variant" }
    ]);

    if(!response){
        res.status(400).json({msg: "error"})
    }
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
};


const getAllUserAddressByID = async(req, res) => {
    try {
        const {id} = req.params;
        const response = await Address.aggregate([
            {
                $match: { user_id: id}
            },
            {
                $lookup:{
                    from: "states",
                    localField: "state",
                    foreignField: "state_id",
                    as: "stateInfo"
                }
            },
            {
                $unwind: "$stateInfo"
            }
        ])

        if(!response){
            return res.status(404).json({msg: "Error"});
        }

        res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}

const getAddressByID = async(req, res) => {
    try {
        const {id} = req.params;
        const response = await Address.aggregate([
             {
                $match: { _id: new mongoose.Types.ObjectId(id) }   // filter first
             },
             {
                $lookup: {
                  from: "states",
                  localField: "state",
                  foreignField: "state_id",
                  as: "stateInfo"
              }     
             },
             { 
                $unwind: "$stateInfo" 
             },
    ]);

        if(!response){
            return res.status(404).json({msg: "Error"});
        }

        res.status(200).json(response[0])
    } 
    catch (error) 
    {
        console.log(error)
    }
}

const deleteUserAddress = async (req, res) => {
    try {
        const {id} = req.params;
        const response = await Address.findOneAndDelete({_id: id})

        if(!response){
            return res.status(404).json({msg: "Error Not Deleted"})
        }

        res.status(200).json({msg: "Deleted"});

    } catch (error) {
        console.log(error)
    }
}

const editUserAddressByID = async(req, res) => {
    try {
        const response = await Address.findByIdAndUpdate( req.params.id,
            { $set: req.body },
            { new: true }
        );

        if(!response){
            return res.status(404).json({msg: "Not Updated Error"})
        }

        res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}

const getAddressByIdForEdit = async(req, res) => {
    try {
        const {id} = req.params;
        const response = await Address.findById({_id: id});

        if(!response){
            return res.status(404).json({msg:"Error"});
        }
        
        res.status(200).json(response);
    } catch (error) {
     console.log(error);   
    }
}

module.exports = { addCart, getState, getCities, getCartByUser, deleteCartByID, addUserAddress, getAllUserAddressByID, getAddressByID, deleteUserAddress, editUserAddressByID, getJoinCartByUserID, getAddressByIdForEdit }