const express = require("express");
const router = express.Router();
const adminControllers = require("../controllers/admin-controllers");
const authcontrollers = require("../controllers/auth-controllers");
const authMiddleware = require("../middlewares/auth-middleware");
const adminMiddleware = require("../middlewares/admin-middleware");
const productControllers = require("../controllers/product-controllers");
const orderControllers = require("../controllers/order-controllers");
const upload = require("../utils/uploads")
const validate = require("../middlewares/validate-middleware")
const joiSchema = require("../validators/auth-validator");


router.route("/users").get(authMiddleware, adminMiddleware, adminControllers.getAllUsers);
router.route("/user/delete/:id").delete(authMiddleware, adminMiddleware, adminControllers.deleteUser)
router.route("/add/product").post(authMiddleware, adminMiddleware, upload.array("images", 100), validate(joiSchema.productSchema), productControllers.createProduct);
router.route("/category").get(authMiddleware, adminMiddleware, productControllers.productCategory);
router.route("/flavour").get(authMiddleware, adminMiddleware, productControllers.productFlavour);
router.route("/weight").get(authMiddleware, adminMiddleware, productControllers.productWeight);
router.route("/brand").get(authMiddleware, adminMiddleware, productControllers.productBrand);
router.route("/getUserByID/:id").get(authMiddleware, adminMiddleware, authcontrollers.getUserByID);
router.route("/editUserData/:id").patch(authMiddleware, adminMiddleware, validate(joiSchema.editUserSchema), authcontrollers.editUserData);
router.route("/getAllOrders").get(authMiddleware, adminMiddleware, orderControllers.getAllOrders);
router.route("/getOrderByUser/:id").get(authMiddleware, adminMiddleware, orderControllers.getOrderByUser);
router.route("/getOrderById/:id").get(authMiddleware, adminMiddleware, orderControllers.orderById);
router.route("/getAllProductsList").get(authMiddleware, adminMiddleware, productControllers.getAllProduct);
router.route("/getProductVariantByID/:id").get(authMiddleware, adminMiddleware, productControllers.getProductVariantByID);

module.exports = router;
