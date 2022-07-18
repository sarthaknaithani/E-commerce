const mongoose = require("mongoose")
const { ObjectId } = mongoose.Schema

const ProductCartSchema = new mongoose.Schema({
    product: {
        type: ObjectId,
        ref: "Product"
    },
    name: String,
    count: Number,
    price: Number
});

const ProductCart = mongoose.model("ProductCart", ProductCartSchema)

const OrderSchema = new mongoose.Schema(
    {
        products: [ProductCartSchema],//array of products in the cart
        transaction_id: {},
        amount: { type: Number },
        address: String,
        status: {
            type: String,
            default: "Recieved",
            enum: ["Cancelled", "Delivered", "Shipped", "Processing", "Recieved"]
        },
        updated: Date, //this is when the admin will provide the updates on the order
        user: { //who placed the order
            type: ObjectId,
            ref: "User"
        }
    }, 
    { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema)

module.exports = {Order, ProductCart };