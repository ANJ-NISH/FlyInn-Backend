const mongoose=require("mongoose");


const UserSchema=new mongoose.Schema({
   name : {type: String, required: true},
   email: {type: String, required: true, unique: true},
   password: {type: String},
   googleId: {type: String},
   avatar: {type: String},
},
{timestamps: true}
)


module.exports=mongoose.model("User", UserSchema);