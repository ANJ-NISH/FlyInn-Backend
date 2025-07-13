const express=require("express");
const mongoose=require("mongoose");
const cors=require("cors");
const session=require("express-session")
const passport=require("passport");
const cookieParser=require("cookie-parser")

require("dotenv").config();
require("./config/passport");

const authRoutes=require('./routes/authRoutes');
const accommodationRoutes=require('./routes/accommodationRoutes');
const hotelRoutes=require('./routes/hotelRoutes');

const app=express();

//midlleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser())

//routes
app.use("/", authRoutes);
app.use("/accommodation", accommodationRoutes);
app.use("/hotels", hotelRoutes);

mongoose.connect('mongodb+srv://anuragj990:8LE9RYktlSCnj2c1@cluster0.qtjoh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(()=> {console.log("Connected to MongoDB")}).catch((err)=> {console.log(err)});

app.listen(process.env.PORT, ()=> {console.log("server lsitening on PORT 5000.")})