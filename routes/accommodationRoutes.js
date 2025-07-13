const express= require('express');
const router= express.Router();
const cloudinary= require('../utils/cloudinary');
const upload= require('../middleware/multer');
const Accommodation=require('../models/Accommodation');
const { getSearchResult } = require('../controllers/hotelController');


router.get('/searchresult/:city', getSearchResult);

router.post('/upload', upload.array('images', 4), async(req,res)=>{
    try
    {

        const {name, type, address, city, state, country, pin, facilities, description, price, rooms}=req.body;

        if(!req.files || req.files.length===0)
        {
            return res.status(400).json({error: "At least one image is required."});
        }

        const imageUrls = await Promise.all(
            req.files.map((file) => {
              return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                  { resource_type: "image" },
                  (error, result) => {
                    if (error) {
                      reject(error);
                    } else {
                      resolve(result.secure_url);
                    }
                  }
                );
          
                stream.end(file.buffer);
              });
            })
          );

        

        const newAccommodation= new Accommodation({
          name,
          type,
          address: `${address} ${city} ${state} ${country} ${pin}`,
          city: city,
          facilities: facilities ? facilities.split(',') : [],
          description,
          images: imageUrls,
          pricePerNight: price,
          availableRooms: rooms,
        }); 

        

        await newAccommodation.save();
        res.status(201).json({message: "Accommodation added succesfully", data: newAccommodation});
    }
    catch(error)
    {
        res.status(500).json({error: error.message});
    }
});



module.exports= router;