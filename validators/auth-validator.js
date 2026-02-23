const joi = require("joi");

//creating an object schema for validation
const signupSchema = joi.object({
  name: joi.string().min(3).max(20).required().messages({ "string.base": "Name is required", "string.empty": "Name cannot be empty", "any.required": "Name is required", }),  
  email: joi.string().min(5).email().lowercase().required().messages({ "string.base": "Email is required", "string.empty": "Email cannot be empty", "any.required": "Proper email is required", "string.email" : "Proper email is required", }),
  phone: joi
    .string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "any.required": "Phone number is required",
      "string.pattern.base":
        "Phone number must be a valid 10-digit Indian mobile number",
    }),
  password: joi.string().min(6).required(),
});

const editUserSchema = joi.object({
  name: joi.string().min(3).max(20).required().messages({ "string.base": "Name is required", "string.empty": "Name cannot be empty", "any.required": "Name is required", }),
  email: joi.string().min(5).email().lowercase().required().messages({ "string.base": "Email is required", "string.empty": "Email cannot be empty", "any.required": "Proper Email is required", }),
  phone: joi .string() .pattern(/^[6-9]\d{9}$/) .required() .messages({ "string.pattern.base": "Phone number must be a valid 10-digit Indian mobile number", }),
  password: joi.string().min(6).required(), }).unknown(true);


const reviewSchema = joi.object({ 
  user: joi.string().required(), 
  product: joi.string().required(), 
  variant_id: joi.string().required(), 
  cust_rating: joi.number().min(0).required().
  messages({ "string.base": "Rating is required", 
    "string.empty": "Rating cannot be empty", 
    "any.required": "Rating is required" }), 
  cust_title: joi.string().min(5).required().messages({ "string.base": "Title is required", "string.empty": "Title cannot be empty", "any.required": "Title is required", }), cust_description: joi.string().min(6).required().messages({ "string.base": "Description is required", "string.empty": "Description cannot be empty", "any.required": "Description is required", }), 
  product_flavour: joi.string().required(), 
  product_weight: joi.number().required(), });

const variantSchemaJoi = joi.object({
  weight: joi.number().integer().min(0).empty("").when(
    joi.ref("/category"),
    {
      is: "Workout Essentials",
      then: joi.optional(),
      otherwise: joi.required().messages({
        "any.required": "Weight is required",
        "number.base": "Weight must be a number",
        "number.min": "Weight must be a positive number",
      }),
    }
  ),

  qty: joi.number().integer().min(0).empty("").when(
    joi.ref("/category"),
    {
      is: "Workout Essentials",
      then: joi.required().messages({
        "any.required": "Qty is required for Workout Essentials",
        "number.base": "Qty must be a number",
        "number.min": "Qty must be a positive number",
      }),
      otherwise: joi.optional(),
    }
  ),

  flavour: joi.string().empty("").when(
    joi.ref("/category"),
    {
      is: "Workout Essentials",
      then: joi.optional(),
      otherwise: joi.required().messages({
        "any.required": "Flavour is required",
        "string.base": "Flavour cannot be empty",
      }),
    }
  ),

  inStock: joi.number().integer().min(0).required().messages({
    "any.required": "Number of stock is required",
    "number.base": "Number of stock must be a number and is required",
    "number.min": "Number of stock cannot be negative",
  }),

  mrp: joi.number().min(0).required().messages({
    "any.required": "MRP is required",
    "number.base": "MRP must be a number",
    "number.min": "MRP cannot be negative",
  }),

  price: joi.number()
    .min(0)
    .less(joi.ref("mrp"))
    .required()
    .messages({
      "any.required": "Price is required",
      "number.base": "Price must be a number",
      "number.min": "Price cannot be negative",
      "number.less": "Price should be less than MRP",
    }),

  image: joi.array().min(1).required().messages({
    "array.base": "Image is required",
    "array.min": "At least one image is required",
    "any.required": "Image is required",
  }),
});


const productSchema = joi.object({ 
  name: joi.string().required().messages({ "string.base": "Name is required", "string.empty": "Name cannot be empty", "any.required": "Name is required", }), 
  brand: joi.string().required().messages({ "string.base": "Brand is required", "string.empty": "Brand cannot be empty", "any.required": "Brand is required", }), 
  category: joi.string().required().messages({ "string.base": "Category is required", "string.empty": "Category cannot be empty", "any.required": "Category is required", }), 
  description: joi.string().min(10).required().messages({ "string.base": "Description is required", "string.empty": "Description cannot be empty", "any.required": "Description is required", }), 
  supplier: joi.string().required().messages({ "string.base": "Supplier is required", "string.empty": "Supplier cannot be empty", "any.required": "Supplier is required", }), 
  manufacturer: joi.string().required().messages({ "string.base": "Manufacturer is required", "string.empty": "Manufacturer cannot be empty", "any.required": "Manufacturer is required", }), 
  allergens: joi.string().optional(), 
  form: joi.string().required().messages({ "string.base": "Form must ios required", "string.empty": "Form cannot be empty", "any.required": "Form is required", }), 
  bestBefore: joi.string().required().messages({ "string.base": "Best before is required", "string.empty": "Best before cannot be empty", "any.required": "Best before is required", }), 
  dietaryPreference: joi.string().required().messages({ "string.base": "Dietary preference is required", "string.empty": "Dietary preference cannot be empty", "any.required": "Dietary preference is required", }), 
  fssai: joi.string().required().messages({ "string.base": "FSSAI is required", "string.empty": "FSSAI cannot be empty", "any.required": "FSSAI is required", }), 
  ingredients: joi.string().required().messages({ "string.base": "Ingredients is required", "string.empty": "Ingredients cannot be empty", "any.required": "Ingredients is required", }), 
  servingSize: joi.number().integer().min(0).empty("").when("category", {
  is: "Workout Essentials",
  then: joi.optional(),
  otherwise: joi.required().messages({
    "any.required": "Serving size is required",
    "number.base": "Serving size must be a number",
    "number.min": "Serving size must be a positive number",
  }),
}),

proteinPerScoop: joi.number().integer().min(0).empty("").when("category", {
  is: "Workout Essentials",
  then: joi.optional(),
  otherwise: joi.required().messages({
    "any.required": "Protein per scoop is required",
    "number.base": "Protein per scoop must be a number",
    "number.min": "Protein per scoop must be a positive number",
  }),
}),
  variant: joi.array().items(variantSchemaJoi).min(1).required() });

const loginSchema = joi.object({
  email: joi.string().min(5).email().required(),
  password: joi.string().min(6).required(),
});

const addressSchema = joi.object({ 
  full_name: joi.string().min(5).required().messages({ "string.base": "Full name is required", "string.empty": "Full name cannot be empty", "any.required": "Full name is required", }), 
  phone: joi .string() .pattern(/^[6-9]\d{9}$/) .required() .messages({ "string.empty": "Phone number be empty", "any.required": "Phone number is required", "string.pattern.base": "Phone number must be a valid 10-digit Indian mobile number", }), 
  house_no: joi.string().min(5).required().messages({ "string.base": "House no is rquired", "string.empty": "House no cannot be empty", "any.required": "House no is required", }), 
  area: joi.string().min(5).required().messages({ "string.base": "Area is rquired", "string.empty": "Area cannot be empty", "any.required": "Area is required", }), 
  landmark: joi.string().min(5).required().messages({ "string.base": "Landmark is rquired", "string.empty": "Landmark cannot be empty", "any.required": "Landmark is required", }), 
  pincode: joi .string() .pattern(/^[1-9][0-9]{5}$/) .required() .messages({ "string.empty":"Pincode is required", "any.required":"Pincode is required", "string.pattern.base": "Pincode must be a valid 6-digit Indian postal code", }), 
  state: joi.string().required().messages({ "string.base": "State is required", "string.empty": "State cannot be empty", "any.required": "State is required", }), 
  city: joi.string().required().messages({ "string.base": "City is required", "string.empty": "City cannot be empty", "any.required": "City is required", }), 
  address_type: joi.string().required().messages({ "string.base": "Address type is required", "string.empty": "Address type cannot be empty", "any.required": "Address type is required", }), }).unknown(true);

module.exports = { signupSchema, loginSchema, reviewSchema, addressSchema, productSchema, editUserSchema };
