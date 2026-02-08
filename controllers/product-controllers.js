// ------------------- Get Products ---------------------- //
const { Product, Category, Flavour, Weight, Brand} = require("../models/product-model");
const Wishlist = require("../models/whishlist-model");
const Product_Review = require("../models/customer_review-model");
const mongoose = require("mongoose");


const allProduct = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const response = await Product.find().skip(skip).limit(limit);

    const totalProducts = await Product.countDocuments();

    if (!response) {
      return res.status(400).json({ Products: "Not able to fetch products" });
    }
    res.status(200).json({response, 
      pagination: {
                   totalProducts, 
                   currentPage: page, 
                   totalPages: Math.ceil(totalProducts/limit), 
                   limit
                  }
                });
  } catch (error) {
    next(`Products: ${error}`);
  }
};

const createProduct = async (req, res) => {
  try {

    const { name, brand, category, description, supplier, manufacturer, form, allergens,
    bestBefore,
    dietaryPreference,
    ingredients,
    servingSize,
    proteinPerScoop,
    fssai, variant,  } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ msg: "Images are required" });
    }

     // Images uploaded to cloudinary
    const imageUrls = req.files.map((file) => file.path);

    // Parse variants (sent as JSON string)
    const parsedVariants = JSON.parse(variant);

    // Attach images to correct variant
    let imageIndex = 0;
    parsedVariants.forEach((v) => {
      const imageCount = v.image.length;
      v.image = imageUrls.slice(imageIndex, imageIndex + imageCount);
      imageIndex += imageCount;
    });

    const products = await Product.create({
      name,
      brand,
      category,
      description,
      supplier,
      manufacturer,
      form,
      allergens,
    bestBefore,
    dietaryPreference,
    ingredients,
    fssai,
    proteinPerScoop,
    servingSize,
      variant : parsedVariants
    });

    if (products) {
      return res.status(200).json({ msg: "Product Added Successfully!!", products });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Server error" });
  }
};

const productCategory = async (req, res) => {
  try {
    const response = await Category.find();
    if (!response) {
      return res.status(400).json({ msg: "Unable to fetch categories" });
    }
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

const productBrand = async (req, res) => {
  try {
    const response = await Brand.find();
    if(!response){
      return res.status(400).json({msg: "Unable to fetch brands"});
    }
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
}

const productFlavour = async (req, res) => {
  try {
    const response = await Flavour.find();
    if (!response) {
      return res.status(400).json({ msg: "Unable to fetch flavours" });
    }
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

const productByID = async (req, res) => {
  const { id } = req.params;
  try{
    const response = await Product.findById(id);
    if(!response)
    {
      return res.status(400).json({msg: "Not Found"});
    }
    res.status(200).json(response);
  }
  catch(error){
    next(error);
  }
}

const productJoin = async (req, res) => {
  try {
    const {product_brand, product_category} = req.body;
    const product = await Product.find({
                 brand: product_brand,
                 category: product_category
          });


    if(!product){
      res.status(400).json({msg: "error"});
    }

    res.status(200).json(product);
  } catch (error) {
    console.log(error)
  }
}

const productWeight = async (req, res) => {
  try {
    const response = await Weight.find();
    if(!response)
    {
      return res.status(400).json({msg: "Not able to fetch"});
    }

    res.status(200).json(response);
  } catch (error) {
    next(error)
  }
}

const productReview = async (req, res) => {
  try {
    const { user, product, variant_id, cust_rating, cust_title, cust_description, product_flavour, product_weight } = req.body;
    const response = await Product_Review.create({ user, product, variant_id, cust_rating, cust_title, 
                                   cust_description, product_flavour, product_weight });
                                   
    if(!response){
      return res.status(400).json({ error: "Review Not Published"});
    }


    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
}

// const getAllProductReview = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const response = await Product_Review.find({variant_id: id});
    
//     if(!response){
//       return res.status(400).json({msg: "Review Not Found"});
//     }

//     res.status(200).json(response);
//   } catch (error) {
//     console.log(error);
//   }
// }

const AllProductReview = async (req, res) => {
  try {
    const response = await Product_Review.find();
    
    if(!response){
      return res.status(400).json({msg: "Review Not Found"});
    }

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
}

const wishlistProduct = async (req, res) => {
  try {
    const { user_id, product_id, variant_id, date } = req.body;
    const wishlistCreated = await Wishlist.create({ user_id, product_id, variant_id, date });

    if(!wishlistCreated){
      return res.status(400).json({msg:"Error"})
    }
    res.status(200).json(wishlistCreated);
  } catch (error) {
    console.log(`Wishlist: ${error}`);
  }
};

const getWishlists = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Wishlist.find({user_id: id});
    
    if(!response){
      return res.status(400).json({msg: "Not found"});
    }

    res.status(200).json(response);
  } catch (error) {
    console.log(error)
  }
}

const UserWishlistsJoin = async (req, res) => {
  try {
    const { id } = req.params;

    const response = await Wishlist.aggregate([
      // 1️⃣ Match user
      {
        $match: {
          user_id: id
        }
      },

      // 2️⃣ Join with products via variant_id
      {
        $lookup: {
          from: "products",
          let: { variantId: "$variant_id" },
          pipeline: [
            { $unwind: "$variant" },
            {
              $match: {
                $expr: {
                  $eq: ["$variant._id", "$$variantId"]
                }
              }
            },
            {
              $project: {
                name: 1,
                brand: 1,
                category: 1,
                variant: 1
              }
            }
          ],
          as: "product"
        }
      },

      // 3️⃣ Flatten product array
      {
        $unwind: "$product"
      }
    ]);

    if (!response.length) {
      return res.status(404).json({ msg: "Wishlist empty" });
    }

    res.status(200).json(response);

  } catch (error) {
    console.error("Wishlist Join Error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

const deleteWishlist = async (req, res) => {
  try {
    const { _id, user_id } = req.body;
    const response = await Wishlist.findOneAndDelete({ _id, user_id });

    if(!response){
      return res.status(404).json({msg: "Not deleted"})
    }
      res.status(200).json({msg: "Deleted"})
  } catch (error) {
      res.status(500).json({ error });  }
}

const deleteWishlistByProductID = async (req, res) => {
  try {
    const { user_id, variant_id } = req.body;
    const response = await Wishlist.findOneAndDelete({ user_id, variant_id});

    if(!response){
      return res.status(404).json({msg: "Not deleted"})
    }
      res.status(200).json({msg: "Deleted"})
  } catch (error) {
      res.status(500).json({ error });  }
}


const listSortProduct = async (req, res) => {

  try {
    const {
      search,
      brand,
      category,
      flavour,
      minWeight,
      maxWeight,
      weightUnit,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
      page = 1,
      limit = 6
    } = req.body;


    const skip = (page - 1) * limit;

    /** -------------------------
     * PRODUCT LEVEL FILTER
     ------------------------- */
    const productMatch = {};
    if (brand) productMatch.brand = brand;
    if (category) productMatch.category = category;

    if(search){
      productMatch.name = { $regex: search, $options: "i"};
    }

    /** -------------------------
     * VARIANT LEVEL FILTER
     ------------------------- */
    const variantMatch = {};

    if (flavour) variantMatch["variant.flavour"] = flavour;

    if (minWeight || maxWeight) {
      variantMatch["variant.weight"] = {};
        if (minWeight) variantMatch["variant.weight"].$gte = Number(minWeight);
        if (maxWeight) variantMatch["variant.weight"].$lte = Number(maxWeight);
    }
    if (weightUnit) variantMatch["variant.weightUnit"] = weightUnit;

    if (minPrice || maxPrice) {
      variantMatch["variant.price"] = {};
        if (minPrice) variantMatch["variant.price"].$gte = Number(minPrice);
        if (maxPrice) variantMatch["variant.price"].$lte = Number(maxPrice);
    }

    /** -------------------------
     * AGGREGATION PIPELINE
     ------------------------- */
    const pipeline = [
      { $match: productMatch },
      // explode variants
      { $unwind: "$variant" },
      // apply variant filters
      { $match: variantMatch },
      // regroup variants back into product
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          brand: { $first: "$brand" },
          category: { $first: "$category" },
          description: { $first: "$description" },
          dietaryPreference: { $first: "$dietaryPreference"},
          createdAt: { $first: "$createdAt" },
          variant: { $push: "$variant" },
          minVariantPrice: { $min: "$variant.price" },
          maxVariantPrice: { $max: "$variant.price" }

        }
      },
       // sorting
      { 
        $sort: sortBy === "price"
               ? sortOrder === 1 ? { minVariantPrice: 1 } : {maxVariantPrice: -1}
                 : sortBy === "newest" && { createdAt: -1 } 
      },
      { $skip: skip },
      { $limit: limit }
    ];

     const products = await Product.aggregate(pipeline);

     const countPipeline = [
      { $match: productMatch },
      { $unwind: "$variant" },
      { $match: variantMatch },
      {
        $group: {
          _id: "$_id"
        }
      },
      { $count: "total" }
    ];

    const totalResult = await Product.aggregate(countPipeline);
    const totalProducts = totalResult[0]?.total || 0;

    res.status(200).json({
      products,
      totalProducts,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page
    });


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Filtering failed" });
  }
};


const search = async (req, res) => {
  try {
    const  q  = req.query.q;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const skip = (page - 1) * limit;

  const products = await Product.aggregate([
    { $match: {
    $or: [
      { name: { $regex: q, $options: "i" } },
      { brand: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } }
    ]
  }},
  {
    $project: {
      name: 1,
      brand: 1,
      category: 1,
      image: { $arrayElemAt: ["$variant.image", 0] },
      weight: { $arrayElemAt: ["$variant.weight",0]},
      weightUnit: { $arrayElemAt: ["$variant.weightUnit",0]}
    }
  },
]).skip(skip).limit(limit)
    // .select("name brand category variant.image");

  res.status(200).json(products);
  } catch (error) {
    console.log(error)
  }
}


// const searchProduct = async (req, res) => {
//   try {
//     const  q  = req.query.q;
//     const page = Number(req.query.page) || 1;
//     const limit = Number(req.query.limit) || 6;
//     const skip = (page - 1) * limit;
//     const filter = {
//       $or: [
//       { name: { $regex: q, $options: "i" } },
//       { brand: { $regex: q, $options: "i" } },
//       { category: { $regex: q, $options: "i" } }
//     ]
//     }
    
//     const response = await Product.find(filter).skip(skip).limit(limit);

//     const totalProducts = await Product.countDocuments(filter);


//     if(!response){
//       res.status(400).json({msg:"error"});
//     }

//     res.status(200).json({response,
//       pagination: {
//                    totalProducts, 
//                    currentPage: page, 
//                    totalPages: Math.ceil(totalProducts/limit), 
//                    limit
//                   }
//     });
//   } catch (error) {
//     console.log(error);
//   }
// }


const getProductWithReviewsSorting = async (req, res) => {
  try {
    const { id } = req.params;
    const { sort = "all" } = req.query;

    // const skip = (page - 1) * limit; 

    let reviewSort = {};

    switch (sort) {
      case "newest":
        reviewSort = { createdAt: -1 };
        break;
      case "rating_desc":
        reviewSort = { cust_rating: -1 };
        break;
      case "rating_asc":
        reviewSort = { cust_rating: 1 };
        break;
      default:
        reviewSort = { createdAt: 1 };
    }

    const result = await Product.aggregate([
      // 1️⃣ explode variants
      { $unwind: "$variant" },

      // 2️⃣ match selected variant
      {
        $match: {
          "variant._id": new mongoose.Types.ObjectId(id)
        }
      },

      // 3️⃣ lookup reviews by variantId
      {
        $lookup: {
          from: "product_reviews",
          let: { vId: "$variant._id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$variant_id", "$$vId"] }
              }
            },
            { $sort: reviewSort }
          ],
          as: "reviews"
        }
      },

      // 4️⃣ final shape
      {
        $project: {
          _id: 0,
          productId: "$_id",
          productName: "$name",
          variant: 1,
          reviews: 1
        }
      },
     
    ]);

    res.status(200).json(result[0] || { 
      reviews: [],  
      });
     
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};


const getAllProduct = async (req, res, next) => {
try {
  const response = await Product.find();
  if(!response){
    res.status(404).json("error from server");
  }

  res.status(200).json(response); 
 
} catch (error) {
  res.status(404).json(error)
  console.log(error);
  next();
}
}

module.exports = {
  allProduct,
  wishlistProduct,
  createProduct,
  productCategory,
  productFlavour,
  productByID,
  productWeight,
  productBrand,
  productReview,
  getAllProduct,
  getWishlists,
  deleteWishlist,
  productJoin,
  UserWishlistsJoin,
  deleteWishlistByProductID,
  listSortProduct,
  search,
  // searchProduct,
  getProductWithReviewsSorting,
  AllProductReview
};
