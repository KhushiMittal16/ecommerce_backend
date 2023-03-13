const express = require("express");
const router = express.Router();
// const {
//   create,
//   productById,
//   read,
//   remove, 
//   update,
//   list,
//   listRelated,
//   listCategories,
//   listBySearch,
//   photo, 
//   listByCategory,
//   listSearch,
// } = require("../controllers/product");
const {
  create,
  productById,
  read,
  remove,
  update,
  list,
  listRelated,
  listCategories,
  listBySearch,
  // photo,
  listByCategory,
  listSearch,
} = require("../controllers/productNew");
const { userById } = require("../controllers/user");
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { uploadImage } = require("../controllers/Image");

router.get("/product/:productId", read);
router.get("/products/related/:productId", listRelated);
router.post("/product/create/:userId", requireSignin, isAuth,isAdmin, create);
router.delete(
  "/product/:productId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  remove
);
router.put(
  "/product/:productId/:userId",
  requireSignin,
  isAuth,
  isAdmin,
  update
);
router.post("/uploadimage",uploadImage)
router.get("/products", list);
router.get("/products/related/:productId", listRelated);
router.get("/products/categories", listCategories);
router.post("/products/by/search", listBySearch);
router.get("/products/:search", listSearch);
router.get("/products/:category/:search", listByCategory);
// router.get("/products/photo/:productId", photo);

router.param("userId", userById);
router.param("productId", productById);
module.exports = router;
