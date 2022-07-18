require('dotenv').config()

const mongoose = require('mongoose');
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//My routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const stripeRoutes = require("./routes/stripepayment");
const paymentBRoutes = require("./routes/paymentBRoutes");

//DB connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true, //this will help us to keep our database alive(without this it can be done but just to be sure)
    useCreateIndex: true
})
.then(() => {
    console.log("DB CONNECTED")
});

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//My Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", stripeRoutes);
app.use("/api", paymentBRoutes);


//Port
const port = process.env.PORT || 8000; // process is where it attach all the dependencies and env is the file we created


//Starting a server
app.listen(port, () => {
    console.log(`app is running at ${port}`);
});