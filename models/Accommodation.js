const mongoose=require('mongoose');


const accommodationSchema=new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    type:
    {
        type: String,
        enum: ['Hotel', 'Villa', 'Resort', 'Hostel'],
        required: true,
    },
    address:
    {
       type: String, required: true,
    },
    city:
    {
        type: String, required: true,
    },
    rating: {type: Number, min:0, max:10, default: 0},
    reviewCount: {type: Number, default: 0},
    reviews: [
        {
            user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
            username: {type: String},
            comment: {type: String},
            rating: {type: Number, min: 0, max: 10, required: true},
            createdAt: {type: Date, default: Date.now}
        }
    ],
    facilities: [{type: String}],
    description: {type: String, required: true},
    images: [{type: String, required: true}],
    pricePerNight: {type: Number, required: true},
    availableRooms: {type: Number, required: true},

});


module.exports= mongoose.model('Accommodation', accommodationSchema);