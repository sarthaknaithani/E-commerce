const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.getProductById = (req, res ,next, id) => {
    Product.findById(id)
    .populate("category")
    .exec((err, product) => {
        if(err){
            res.status(400).json({
                error: "Product not found"
            });
        } 
        req.product = product;
        next();
    });
};

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm(); //object form of formidable. This takes 3 parameters first err second fileds(name,description, etc) third files
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "problem with image"
            });
        }
        //destructure the fields
        const { name, description, price, category, stock} = fields; //this line means that when we use price it means fields.price

        if(
            !name ||
            !description ||
            !price ||
            !category ||
            !stock
        ){
            return res.status(400).json({
                error: "Please include all fields"
            });
        }
        
        let product = new Product(fields);

        //handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File size too big!"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
            //these two lines save the photo into the DB
        }
        //console.log(product);

        //save to the DB
        product.save((err, product) => {
            if(err){
                res.status(400).json({
                    error: "Saving tshirt in DB failed"
                });
            }
            res.json(product);
        });
    });
};

exports.getProduct = (req, res) => {
    req.product.photo = undefined;
    return res.json(req.product);
};

//middleware
exports.photo = (req, res, next) => {
    if(req.product.photo.data){ // safety chaining
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
};

//delete controllers
exports.deleteProduct = (req, res) => {
    let product = req.product;
    product.remove( (err, deletedProduct) => {
        if(err) {
            return res.status(400).json({
                error: "Failed to delete the product"
            });
        }
        res.json({
            message: "Deletion was success",
            deletedProduct
        });
    });
};

//update controllers
exports.updateProduct = (req, res) => {
    let form = new formidable.IncomingForm(); //object form of formidable. This takes 3 parameters first err second fileds(name,description, etc) third files
    form.keepExtensions = true;

    form.parse(req, (err, fields, file) => {
        if(err){
            return res.status(400).json({
                error: "problem with image"
            });
        }
        
        //updation code
        let product = req.product;
        product = _.extend(product, fields);

        //handle file here
        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error: "File size too big!"
                });
            }
            product.photo.data = fs.readFileSync(file.photo.path);
            product.photo.contentType = file.photo.type;
            //these two lines save the photo into the DB
        }
        //console.log(product);

        //save to the DB
        product.save((err, product) => {
            if(err){
                res.status(400).json({
                    error: "Updation of product failed"
                });
            }
            res.json(product);
        });
    });
};

//product listing
exports.getAllProducts = (req, res) => {
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id"; //sorting prducts based on id

    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec( (err, products) => {
        if(err) {
            return res.status(400).json({
                error: "No products FOUND"
            });
        }
        res.json(products)
    });
};

exports.getAllUniqueCategories = (req, res) => {
    Product.distinct("category", {}, (err, category) => {
        if(err) {
            return res.status(400).json({
                error: "NO category found"
            });
        }
        res.json(category);
    });
};

//updating inventory
exports.updateStock = (req, res, next) => {
    
    let myOperations = req.body.order.products.map(prod => { //map is used to loop through the products
        return {
            updateOne : {
                filter: {_id: prod._id},
                update: {$inc: {stock: -prod.count, sold: +prod.count}} //prod.count will come from front end
            }
        };
    });
    
    Product.bulkWrite(myOperations, {}, (err, products) => {
        if(err) {
            return res.status(400).json({
                error: "Bulk operation failed"
            });
        }
        next();
    });
};