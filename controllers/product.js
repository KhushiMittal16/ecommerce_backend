const formidable = require("formidable");
const _ = require("lodash");
const lodash = require("lodash");
const path = require("path");
const Product = require("../models/product");
const { errorHandler } = require("../helpers/dbErrorHandler");
const fs = require("fs");
const { result } = require("lodash");

exports.productById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          error: "No product found!!!",
        });
      }
      req.product = product;
      next();
    });
};

exports.read = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  // console.log(form);
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    const { name, description, price, category, quantity, shipping } = fields;
    // console.log(files);
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({
        error: "Please Enter all the required fields!!!",
      });
    }
    if (files.photo) {
      // console.log("FILES PHOTO: ", files.photo);
      if (files.photo.size > 5000000) {
        return res.status(400).json({
          error: "Image should be less than 5mb in size",
        });
      }
      // product.photo.data = // change path to filepath
      // product.photo.contentType = files.photo.mimetype; // change type to mimetype

      let product = new Product({
        name,
        description,
        price,
        category,
        quantity,
        shipping,
        photo: {
          data: fs.readFileSync(files.photo.filepath),
          contentType: files.photo.mimetype,
        },
      }).save();
      // return

      // product.save();
      res.json(product);
    }
    // console.log(product)
    // console.log(files)
    // res.json(product)
  });
};

exports.update = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Image could not be uploaded",
      });
    }
    // const { name, description, price, category, quantity, shipping } = fields;
    // if (
    //   !name ||
    //   !description ||
    //   !price ||
    //   !category ||
    //   !quantity ||
    //   !shipping
    // ) {
    //   return res.status(400).json({
    //     error: "Please Enter all the required fields!!!",
    //   });
    // }
    let product = req.product;
    product = _.extend(product, fields);
    if (files.photo) {
      // console.log("FILES PHOTO: ", files.photo);
      if (files.photo.size > 1000000) {
        return res.status(400).json({
          error: "Image should be less than 1mb in size",
        });
      }
      product.photo.data = fs.readFileSync(files.photo.filepath); // change path to filepath
      product.photo.contentType = files.photo.mimetype; // change type to mimetype
    }
    product.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err),
        });
      }
      res.json(result);
    });
  });
};

exports.remove = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json({
      message: "Product deleted Successfully!!!",
    });
  });
};
/*
sell/arrival
by sell= /products?sortBy=sold&ordeer=desc&limit=4
by arrival= /products?sortBy=createdAt&ordeer=desc&limit=4
if no params are sent, then all products are returned
*/

exports.list = (req, res) => {
  let order = req.query.order ? req.query.order : "asc";
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;
  Product.find()
    .select("-photo")
    .populate("category")
    .sort({ createdAt: -1 })
    .limit(limit)
    // .skip(0)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found!",
        });
      }
      res.send(products);
    });
};

// This func will return all the related product i.e. the products having same category to the product searched

exports.listRelated = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 6;
  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .limit(limit)
    .populate("category", "_id name")
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found!",
        });
      }
      res.send(products);
    });
};

exports.listCategories = (req, res) => {
  Product.distinct("category", {}, (err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "Product not found!",
      });
    }
    res.send(categories);
  });
};

exports.listBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : "desc";
  let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
  let limit = req.body.limit ? parseInt(req.body.limit) : 6;
  let skip = 1;
  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  Product.find(findArgs)
    .select("-photo")
    .populate("category")
    .sort([[sortBy, order]])
    // .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Products not found",
        });
      }
      res.json({
        size: data.length,
        data,
      });
    });
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

exports.listSearch = async (req, res) => {
  //create a query object to hold search value and category value
  // console.log("running till here");
  const query = {};
  // console.log("req");
  let queryname = {
    $or: [
      {
        name: { $regex: req.params.search },
      },
    ],
  };
  const allPost = await Product.find(queryname).lean();
  res.json(allPost);
};

exports.listByCategory = async (req, res) => {
  //create a query object to hold search value and category value
  // console.log("running till here");
  const query = {};
  // console.log("req");
  const allPost = await Product.find({
    category: req.params.category,
    name: { $regex: req.params.search },
  }).lean();
  res.json(allPost);
};

exports.decreaseQuantity = (req, res, next) => {
  console.log("product in cart:",req.body.product);
  let bulkOps = req.body.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item._id },
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });
  // console.log("product in cart:",req.body.product)
  Product.bulkWrite(bulkOps, {}, (error, Products) => {
    if (error) {
      return res.status(400).json({
        error: "could not update product",
      });
    }
    next();
  });
};
