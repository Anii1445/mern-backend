const {Schema, model, mongoose} = require("mongoose");

const customerReviewSchema = new Schema({
    user : {type:String, required:true},
    product: {type: String, required:true},
    variant_id: {type:  mongoose.Schema.Types.ObjectId, required: true},
    cust_rating: {type: Number, reuired: true},
    cust_title: {type: String, required:true},
    cust_description: {type: String, required:true},
    product_flavour: {type: String, required: true},
    product_weight: {type: Number, required: true}
},
{timestamps: true});


const Product_Review = new model("Product_Review", customerReviewSchema);
module.exports = Product_Review;