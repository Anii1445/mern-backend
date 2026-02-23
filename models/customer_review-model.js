const {Schema, model, mongoose} = require("mongoose");

const customerReviewSchema = new Schema({
    user : {type:String},
    product: {type: String},
    variant_id: {type:  mongoose.Schema.Types.ObjectId},
    cust_rating: {type: Number, reuired: true},
    cust_title: {type: String, required:true},
    cust_description: {type: String, required:true},
    product_flavour: {type: String},
    product_weight: {type: Number},
    quantity: {type: Number}
},
{timestamps: true});


const Product_Review = new model("Product_Review", customerReviewSchema);
module.exports = Product_Review;