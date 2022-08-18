const Category= require("../models/category")
const { errorHandler } = require("../helpers/dbErrorHandler");
const category = require("../models/category");

exports.categoryById=(req,res,next,id)=>{
    Category.findById(id).exec((err,category)=>{
        if(err|| !category){
            return res.status(400).json({
                err:'This category does not exist!!!'
            })
        }
        req.category=category;
        next()
    })
}

exports.create=(req,res)=>{
    
    console.log("xyz")
    const category= new Category(req.body)
    category.save((err, data)=>{
        if(err){
            return res.status(400).json({
                error:errorHandler(err)
            })
        }
        res.json({data});
    })
}

exports.read=(req,res)=>{
    Category.find({}).exec((err,category)=>{
        if(err|| !category){
            return res.status(400).json({
                err:'This category does not exist!!!'
            })
        }
        res.json(category)
    })
    
}

exports.update=async(req,res)=>{
    // const category= req.category
    // category.name= req.body.name
    // category.save((err, data)=>{ 
    //     if(err){
    //         return res.status(400).json({ 
    //             error:errorHandler(err)
    //         })
    //     }
    //     res.json(data);
    // })
    const updatedCategory= await category.findByIdAndUpdate(req.params.categoryId,{name:req.body.name},{new:true})
    res.json(updatedCategory)
}

exports.remove=(req,res)=>{
    const category= req.category
    // Category.findOneAndDelete(id);
    category.remove((err, data)=>{
        if(err){
            return res.status(400).json({
                error:errorHandler(err)
            })
        }
        res.json({
            message:"Category Deleted Successfully!"
        });
    })
}


exports.list=(req,res)=>{
    Category.find().exec((err,data)=>{
        if(err){
            return res.status(400).json({
                error:errorHandler(err)
            })
        }
        res.json(data)
    })
}