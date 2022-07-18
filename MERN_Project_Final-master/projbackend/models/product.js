const mongoose = require("mongoose")
const {ObjectId} = mongoose.Schema; //Pulling out an ObjectId.
                                    //We can refer this ObjectId to whatever schema we created.

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        description: {
            type: String,
            trim: true,
            required: true,
            maxlength: 2000
        },
        price: {
            type: Number,
            required: true,
            maxlength: 32,
            trim: true
        },
        category: {         //creating a refrence of category because it will be linked to our category schema.
            type: ObjectId, //pulling this ObjectId from category schema(can be categiry or user).
            ref: "Category",    //refrencing to Category beacuse we want from where this ObjectId is coming.
            required: true
        },
        stock: {
            type: Number
        },
        sold: {
            type: Number,
            default: 0
        },
        photo: {
            data: Buffer,
            contentType: String
        }
    }, 
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema)