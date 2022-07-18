const User = require("../models/user");
const Order = require("../models/order");


exports.getUserById = (req, res, next, id) => { //method for params. getUserById works with params because there is a id
    User.findById(id).exec((err, user) => { //database callback
        if (err || !user) {
            return res.status(400).json({
              error: "No user was found in DB"
            });
          }
        req.profile = user; // created an object inside the request. Storing the user into the object(profile) inside the request.
        next();
    });
};
      
exports.getUser = (req, res) => {
    req.profile.salt = undefined;// these values are as it is in the database. but in the user's profile there is no need to show it so just making it undesfined in the user's profile
    req.profile.encry_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile);
};

exports.updateUser = (req, res) => {
  // we are firing up an update
  User.findByIdAndUpdate(
    {_id : req.profile._id},
    {$set: req.body},
    {new: true, useFindAndModify: false},
    (err, user) => {
      if(err){
        return res.status(400).json({
          error: "You are not authorized to update this information"
        });
      }
      user.salt = undefined;
      user.encry_password = undefined;
      res.json(user);
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Order.find({user: req.profile._id})
  .populate("user", "_id name")//from user we are getting id and name and populating it into Order schema
  .exec((err, order) => {
    if(err || !order) {
      return res.status(400).json({
        error: "No order in this account"
      });
    }
    return res.json(order);
  });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  
  let purchases = [];
  req.body.order.products.forEach(product => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id
    });
  });

  //store this in DB
  User.findOneAndUpdate(
    {_id: req.profile._id},
    {$push: {purchases: purchases}},
    {new: true},//this means from the database send me back the updated object not the old one
    (err, purchases) => {
      if(err){
        return res.status(400).json({
          error: "Unable to save purchase list"
        });
      }
      next();
    }
  );
};