const express = require("express");
const router = express.Router();
const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { create,categoryById,read,update,remove,list} = require("../controllers/category");
const { userSignupValidator } = require("../validator/index");
const { userById } = require("../controllers/user");

router.get("/categories", read);
router.post("/category/create/:userId",requireSignin,isAuth,isAdmin, create);
router.put("/category/update/:categoryId/:userId", requireSignin, isAuth, isAdmin, update);
router.delete("/category/remove/:categoryId/:userId", requireSignin, isAuth, isAdmin, remove);
router.get("/categories", list); 
router.param("userId",userById)
router.param("categoryId",categoryById)
module.exports = router;
  