const express = require("express");
const router = express.Router();
const authcontrollers = require("../controllers/auth-controllers")
const joiSchema = require("../validators/auth-validator");
const validate = require("../middlewares/validate-middleware")
const authMiddleware = require("../middlewares/auth-middleware");
const productControllers = require("../controllers/product-controllers");
const cartControllers = require("../controllers/cart-controllers");
const orderControllers = require("../controllers/order-controllers");


/*-----------------------------------------------------------------
Use the express.Router class  to create modular  route handlers.
A Router instance is  a complete middleware and routing sytem; for this reason, it is often called as "mini-app".
-------------------------------------------------------------------*/


router.route("/").get(authcontrollers.home);
router.route("/register").post(validate(joiSchema.signupSchema), authcontrollers.register);
router.route("/login").post(validate(joiSchema.loginSchema), authcontrollers.login);
router.route("/users").get(authMiddleware, authcontrollers.user);
router.route("/products").get(productControllers.allProduct);
router.route("/product/:id").get(productControllers.productByID);
router.route("/wishlist").post(productControllers.wishlistProduct);
router.route("/flavour").get(productControllers.productFlavour);
router.route("/weight").get(productControllers.productWeight);
router.route("/category").get(productControllers.productCategory);
router.route("/cart").post(authMiddleware, cartControllers.addCart);
router.route("/getUserCart/:id").get(authMiddleware, cartControllers.getCartByUser);
router.route("/brand").get(productControllers.productBrand);
router.route("/customer_review").post(authMiddleware, validate(joiSchema.reviewSchema), productControllers.productReview);
// router.route("/productReviewsByCustomers/:id").get(productControllers.getAllProductReview);
router.route("/allWishlistsByID/:id").get(authMiddleware, productControllers.getWishlists);
router.route("/deleteWhislistByID").delete(authMiddleware, productControllers.deleteWishlist);
router.route("/UserWishlistJoin/:id").get(authMiddleware, productControllers.UserWishlistsJoin);
router.route("/deleteCartsItemsByID").delete(authMiddleware, cartControllers.deleteCartByID);
router.route("/deleteWishlistByProductID").delete(authMiddleware, productControllers.deleteWishlistByProductID);
router.route("/getStates").get(authMiddleware, cartControllers.getState);
router.route("/getCities").get(authMiddleware, cartControllers.getCities);
router.route("/addUserAddress").post(authMiddleware, validate(joiSchema.addressSchema), cartControllers.addUserAddress);
router.route("/getUserAddressByID/:id").get(authMiddleware, cartControllers.getAllUserAddressByID);
router.route("/getAddressByID/:id").get(authMiddleware, cartControllers.getAddressByID);
router.route("/deleteUserAddressByID/:id").delete(authMiddleware, cartControllers.deleteUserAddress);
router.route("/editUserAddressByID/:id").patch(authMiddleware, validate(joiSchema.addressSchema), cartControllers.editUserAddressByID);
router.route("/getAddressByIdForEdit/:id").get(authMiddleware, cartControllers.getAddressByIdForEdit);
router.route("/getProductJoin").post(productControllers.productJoin);
router.route("/listSortProduct").post(productControllers.listSortProduct);
router.route("/getUserByID/:id").get(authMiddleware, authcontrollers.getUserByID);
router.route("/editUserData/:id").patch(authMiddleware, validate(joiSchema.editUserSchema), authcontrollers.editUserData);
router.route("/getJoinCartByUserID/:id").get(authMiddleware, cartControllers.getJoinCartByUserID);
router.route("/search").get(productControllers.search);
// router.route("/searchProduct").get(productControllers.searchProduct);
router.route("/AllProductReview").get(productControllers.AllProductReview);
router.route("/productreviewsorting/:id").get(productControllers.getProductWithReviewsSorting);
router.route("/createOrder").post(authMiddleware, orderControllers.createOrder);
router.route("/getOrderByUser/:id").get(authMiddleware, orderControllers.getOrderByUser);
router.route("/getOrderById/:id").get(authMiddleware, orderControllers.orderById);




module.exports = router;