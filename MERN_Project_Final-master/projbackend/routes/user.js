const express = require("express");
const router = express.Router();

const { getUserById, getUser, updateUser, userPurchaseList} = require("../controllers/user");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");

router.param("userId", getUserById);

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
//whenever there is anything wtih a colon ':' 
//that will be interpreted as userId and this method will automatically populate a req.profile object with user object form the database   
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

router.get("/orders/user/:userId", isSignedIn, isAuthenticated, userPurchaseList);

module.exports = router;