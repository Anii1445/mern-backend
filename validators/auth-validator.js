const joi = require("joi");

//creating an object schema for validation
const signupSchema = joi.object({
  name: joi.string().min(3).max(20).required(),
  email: joi.string().min(5).email().lowercase().required(),
  phone: joi
    .string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be a valid 10-digit Indian mobile number",
    }),
  password: joi.string().min(6).required(),
});

const editUserSchema = joi.object({
  name: joi.string().min(3).max(20).required(),
  email: joi.string().min(5).email().required(),
  phone: joi
    .string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be a valid 10-digit Indian mobile number",
    }),
  password: joi.string().min(6).required(),

}).unknown(true);


const reviewSchema = joi.object({
  user: joi.string().required(),
  product: joi.string().required(),
  variant_id: joi.string().required(),
  cust_rating: joi.number().min(1).required(),
  cust_title: joi.string().min(5).required(),
  cust_description: joi.string().min(6).required(),
  product_flavour: joi.string().required(),
  product_weight: joi.number().required(),
});



const productSchema = joi.object({
    
    name: joi.string().required(),
    brand: joi.string().required(),
    category: joi.string().required(),
    description: joi.string().min(10).required(),
    supplier: joi.string().required(),
    manufacturer: joi.string().required(),
    allergens: joi.string().required(),
    form: joi.string().required(),
    bestBefore: joi.string().required(),
    dietaryPreference: joi.string().required(),
    fssai: joi.string().required(),
    ingredients: joi.string().required(),
    servingSize: joi.number(),
    proteinPerScoop: joi.number(),
    variant: joi.required(),
});

const loginSchema = joi.object({
  email: joi.string().min(5).email().required(),
  password: joi.string().min(6).required(),
});

const addressSchema = joi.object({
  full_name: joi.string().min(5).required(),
  phone: joi
    .string()
    .pattern(/^[6-9]\d{9}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be a valid 10-digit Indian mobile number",
    }),
  house_no: joi.string().min(5).required(),
  area: joi.string().min(5).required(),
  landmark: joi.string().min(5).required(),
  pincode: joi
    .string()
    .pattern(/^[1-9][0-9]{5}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Pincode must be a valid 6-digit Indian postal code",
    }),
  state: joi.string().required(),
  city: joi.string().required(),
  address_type: joi.string().required(),
}).unknown(true);

module.exports = { signupSchema, loginSchema, reviewSchema, addressSchema, productSchema, editUserSchema };
