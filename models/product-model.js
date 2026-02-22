const { required } = require("joi");
const { Schema, model } = require("mongoose");

const variantSchema = new Schema({
        weight: {type: Number},
        flavour: {type: String},
        inStock: {type: Number},
        mrp: {type: Number, required: true},
        price: {type: Number, required: true},
        image: [{type: String, required: true}]
    },
{timestamps: true})

const productSchema = new Schema({
    
    name: {type: String, required: true},
    brand: {type: String, required: true},
    category: {type: String, required: true},
    description: {type: String, required: true},
    supplier: {type: String, required:true},
    manufacturer: {type: String, required: true},
    allergens: {type: String},
    form: { type: String, required: true},
    bestBefore: { type: String, required: true},
    dietaryPreference: { type: String, required: true},
    fssai: { type: String, required: true},
    ingredients: { type: String, required: true},
    servingSize: {type: Number},
    proteinPerScoop: {type: Number},
    variant: [variantSchema],
     

},
{ timestamps: true });

const categorySchema = new Schema({
    category: {type:String, required: true},
})

const flavourSchema = new Schema({
    flavour: {type:String, required:true},
})

const weightSchema = new Schema({
    weight: {type:Number, required:true},
})

const brandSchema = new Schema({
    brand: {type:String, required: true}
})


const Product = new model("Product", productSchema);
const Category = new model("Product_Category", categorySchema);
const Flavour = new model("Product_Flavour", flavourSchema);
const Weight = new model("Product_Weight", weightSchema);
const Brand = new model("Product_Brand", brandSchema);

module.exports = { Product, Category, Flavour, Weight, Brand };