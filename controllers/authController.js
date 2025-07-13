const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");

const User=require('../models/User')

const signorRegister=async (req,res)=>
{
  try
  {
    const {name, email, password}=req.body;

    const user= await User.findOne({email});

    if(!user)
    {
      bcrypt.hash(password, 10,async function(err, hash){

        const newuser=await User.create({name, email, password: hash});
        await newuser.save();
        
        const token=jwt.sign({name, email}, process.env.JWT_SECRET,{ expiresIn: "8760h" });

        res.cookie("token", token ,{httpOnly: true, secure: false,maxAge: 31536000})
        return res.status(201).json({message: "User account created and you are logged in.", name, email})
      })
    }
    else
    {
       bcrypt.compare(password, user.password, function(err, result)
    {
        if(result)
        {
          const token=jwt.sign({name, email}, process.env.JWT_SECRET, { expiresIn: "8760h" });
          res.cookie("token", token, {httpOnly: true, secure: false,maxAge: 31536000});

          return res.status(200).json({message: "Login successful.", name, email})
        }
        else
        {
            return res.status(400).json({message: "Invalid credentials"})
        }
    })
    }
  }
  catch(err)
  {
    res.status(500).json({message: "Server Error."})
  }
}


const getUserinfo=async(req, res)=>
{
  try
  {
   const token=req.cookies.token; 
   const decoded=jwt.verify(token, process.env.JWT_SECRET);
   res.status(200).json({userinfo: decoded});
  }
  catch(err)
  {
   console.log(err);
  }
}


module.exports={signorRegister, getUserinfo}