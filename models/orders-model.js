const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  variant_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  product_qty: { type: Number, required: true },
  product_price: { type: Number, required: true }
});

const ordersSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    items: [orderItemSchema], 
    totalOrderPrice: { type: Number, required: true },
    totalOrderMRP: { type: Number, required: true },
    paymentMode: {type: String, required: true},
    paymentStatus: {type: String, required: true},
    orderStatus: {type: String, required: true},
    deliverAddress: {type: Object, required: true}
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", ordersSchema);
module.exports = Order;