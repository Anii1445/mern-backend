const { required } = require("joi");
const { Schema, model, mongoose } = require("mongoose");

const wishlistSchema = new Schema({

    user_id:{type:String, required: true},
    product_id:{type:String, required: true},
    variant_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    date: {type: String, required: true}

});

const Wishlist = new model("Wishlist", wishlistSchema);
module.exports = Wishlist;