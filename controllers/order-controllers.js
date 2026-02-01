const { Cart } = require("../models/cart-model");
const Order = require("../models/orders-model");
const mongoose = require("mongoose");


const createOrder = async (req, res) => {

    try {
    
    const { user_id, items, totalOrderPrice, totalOrderMRP, paymentMode, paymentStatus, orderStatus, deliverAddress } = req.body;
    const response = await Order.create({ user_id, items, totalOrderPrice, totalOrderMRP, paymentMode, paymentStatus, orderStatus, deliverAddress});

    if(!response){
        res.status(400).json("Server Error")
    }

    await Cart.deleteMany({ user_id,  variant_id: {$in: items.map(i => i.variant_id)} });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      response,
    });
     } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server error" });
    }
}

const getOrderByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { months } = req.query;

    let matchStage = {
      user_id: new mongoose.Types.ObjectId(id),
    };

    // 📅 Filter by last N months
    if (months && months !== "all") {
      const date = new Date();
      date.setMonth(date.getMonth() - Number(months));
      matchStage.createdAt = { $gte: date };
    }

    const orders = await Order.aggregate([
      // 1️⃣ Match user
      { $match: matchStage },

      // 2️⃣ Unwind items array
      { $unwind: "$items" },

      // 3️⃣ Lookup product
      {
        $lookup: {
          from: "products",
          localField: "items.product_id",
          foreignField: "_id",
          as: "product",
        },
      },

      // 4️⃣ Unwind product array
      { $unwind: "$product" },

      // 5️⃣ Extract correct variant
      {
        $addFields: {
          variant: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$product.variant",
                  as: "v",
                  cond: {
                    $eq: ["$$v._id", "$items.variant_id"],
                  },
                },
              },
              0,
            ],
          },
        },
      },

      // 6️⃣ Group back order
      {
        $group: {
          _id: "$_id",
          user_id: { $first: "$user_id" },
          paymentStatus: { $first: "$paymentStatus" },
          paymentMode: { $first: "$paymentMode" },
          orderStatus: { $first: "$orderStatus" },
          totalOrderPrice: { $first: "$totalOrderPrice" },
          totalOrderMRP: { $first: "$totalOrderMRP" },
          createdAt: { $first: "$createdAt" },

          items: {
            $push: {
              product: {
                _id: "$product._id",
                name: "$product.name",
                brand: "$product.brand",
              },
              variant: "$variant",
              qty: "$items.qty",
              price: "$items.price",
            },
          },
        },
      },

      // 7️⃣ Sort latest orders first (optional)
      { $sort: { createdAt: -1 } },
    ]);

    if(!orders){
        res.status(404).json("Server Error");
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
};


const orderById = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await Order.aggregate([
      {
        $match : { _id: new mongoose.Types.ObjectId(id)}
      },
      {
        $unwind: "$items"
      },
      {
        $lookup: {
          from: "products",
          localField: "items.product_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { 
        $unwind: "$product"
      },
      {
        $addFields: {
          variant: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$product.variant",
                  as: "v",
                  cond: {
                    $eq: ["$$v._id", "$items.variant_id"],
                  },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          user_id: { $first: "$user_id" },
          paymentStatus: { $first: "$paymentStatus" },
          paymentMode: { $first: "$paymentMode" },
          orderStatus: { $first: "$orderStatus" },
          totalOrderPrice: { $first: "$totalOrderPrice" },
          totalOrderMRP: { $first: "$totalOrderMRP" },
          createdAt: { $first: "$createdAt" },
          deliverAddress: { $first : "$deliverAddress"},

          items: {
            $push: {
              product: {
                _id: "$product._id",
                name: "$product.name",
                brand: "$product.brand",
              },
              variant: "$variant",
              qty: "$items.product_qty",
              price: "$items.product_price",
            },
          },
        },
      },
    ]);

    if(!response){
      res.status(404).json("Error from backend");
    }

    res.status(200).json(response)
  } catch (error) {
    console.log(error);
  }
}

const getAllOrders = async(req, res) => {
  try {
    
    const response = await Order.find();
    if(!response){
      res.status(404).json("error")
    }

    res.status(200).json(response)
  } catch (error) {
    console.log(error)
  }
}


module.exports = { createOrder, getOrderByUser, orderById, getAllOrders }