const { Schema, model, mongoose } = require("mongoose");

const cartSchema = new Schema({

    user_id: {type: String, required: true},
    product_id: {type: String, required: true},
    variant_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    product_price: {type: Number, required: true},
    product_weight: {type: Number, required: true},
    product_flavour: {type: String, required: true},
    product_mrp: {type: Number, required:true},
    product_qty: {type: Number, required: true},
    product_img: []
})

const stateSchema = new Schema({
    name: {type: String, required: true},
    state_id: {type: String, required: true}
})

const citiesSchema = new Schema({
    name: {type: String, required: true},
    state_id: {type: String, required: true}
})

const addressSchema = new Schema({
    user_id: {type: String, required: true},
    full_name: {type:String, required: true},
    phone: {type: String, required: true},
    house_no: {type: String, required: true},
    area: {type: String, required:true},
    landmark: {type: String, required: true},
    pincode: {type: String, required: true},
    state: {type: String, required: true},
    city: {type: String, required: true},
    address_type: {type: String, required: true}
})

const Cart = new model("cart", cartSchema);
const State = new model("state", stateSchema);
const Cities = new model("citie", citiesSchema);
const Address = new model("addresses", addressSchema);

module.exports = { Cart, State, Cities, Address };
