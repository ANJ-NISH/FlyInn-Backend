const express=require("express");
const router=express.Router();

const {getAllHotels, getHotelinfo, getAllResorts, writeReview, getAllVillas, getAllHostels, paymentprocess}= require('../controllers/hotelController');

router.get("/getAll", getAllHotels);

router.get(`/getindi/:hotelname`, getHotelinfo);

router.get("/getAllResorts", getAllResorts);

router.get("/getAllVillas", getAllVillas);

router.get("/getAllHostels", getAllHostels)

router.post(`/rateAcc/:Accname`, writeReview);

router.post("/payment", paymentprocess);


module.exports= router;