const Accommodation=require('../models/Accommodation');
const jwt=require("jsonwebtoken");
const User = require('../models/User');

const sendEmail=require('../utils/sendEmail');

const getAllHotels=async(req,res)=>
{
    try
    {
      const allHotels= await Accommodation.find({type: 'Hotel'});

      res.status(200).json({allHotels});
    }
    catch(err)
    {
       res.status(500).json({message: "Server Error"});
    }
}

const getAllResorts=async(req,res)=>
  {
      try
      {
        const allResorts= await Accommodation.find({type: 'Resort'});
  
        res.status(200).json({allResorts});
      }
      catch(err)
      {
         res.status(500).json({message: "Server Error"});
      }
  }

const getAllVillas=async(req,res)=>
  {
    try
    {
      const allVillas=await Accommodation.find({type: 'Villa'});

      res.status(200).json({allVillas});
    }
    catch(err)
    {
      res.status(500).json({message: "Server error"})
    }
  }  

const getAllHostels=async(req, res)=>
{
  try
  {
    const allHostels=await Accommodation.find({type: 'Hostel'});

    res.status(200).json({allHostels});
  }
  catch(err)
  {
    res.status(500).json({message: "Server error"});
  }
}

const getHotelinfo=async(req,res)=>
{
  try
  {
    const hotelname=req.params.hotelname;

    const indihotel=await Accommodation.find({name: hotelname});

    res.status(200).json({indihotel});
  }
  catch(err)
  {
    res.status(500).json({message: "Server Error"});
  }
}

const getSearchResult=async(req, res)=>
{
  try
  {
    const city=req.params.city;

    const cityAccommodations=await Accommodation.find({city: city});
    res.status(200).json({cityAccommodations});
  }
  catch(err)
  {
    res.status(500).json({message: "Server Error"});
  }
}


const writeReview=async(req, res)=>
{
  try
  {
    const Accname=req.params.Accname;

    const indiAcc= await Accommodation.find({name: Accname});

    if(!indiAcc)
    {
      res.status(401).json({message: "No Accommodation as such"});
    }
    const {rating, comment}=req.body;

    const token=req.cookies.token;

    const decodedinfo=jwt.verify(token, process.env.JWT_SECRET);

    const user=await User.find({email: decodedinfo.email});

    const new_review={user: user[0]._id, username: user[0].name, comment: comment, rating: rating};

    // console.log(new_review);

    indiAcc[0].reviews.push(new_review);

    indiAcc[0].reviewCount=indiAcc[0].reviews.length;

    indiAcc[0].rating= ((parseFloat(indiAcc[0].rating) * parseFloat(indiAcc[0].reviewCount-1))+ parseFloat(rating)) /(parseFloat(indiAcc[0].reviewCount));

    await indiAcc[0].save();

    res.status(200).json({message: "Review added successfully"});
  }
  catch(err)
  {
    res.status(500).json({message: "Server Error"});
  }
}

const paymentprocess=async(req, res)=>
{
  const { formData, hotelinfo, fstartDate, fendDate, adults, children, rooms } = req.body;
  const { name, email, cardNumber, expiry, cvv } =formData

   try {
    await sendEmail(email, {name, hotelinfo, fstartDate, fendDate, adults, children, rooms});
    res.status(200).json({ message: 'Payment successful! Confirmation email sent.' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending confirmation email.' });
  }
}



module.exports= {getAllHotels, getHotelinfo, getSearchResult, getAllResorts, writeReview, getAllVillas, getAllHostels, paymentprocess};