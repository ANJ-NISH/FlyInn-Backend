const express=require("express");
const passport=require("passport");
const jwt=require("jsonwebtoken");

const {signorRegister,getUserinfo}=require('../controllers/authController');


const router=express.Router();


router.post('/registerorlogin', signorRegister);

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {

    const token = jwt.sign(
        {
            name: req.user.name,
            email: req.user.email,
            avatar: req.user.avatar,
        },
        process.env.JWT_SECRET,
        { expiresIn: "8760h" }
    );

    res.cookie("token", token, {
        httpOnly: true,
        secure: false, 
        sameSite: "Strict",
        maxAge: 31536000, // 1 hour
    });
    res.redirect(`http://localhost:5173/`) });


router.get("/auth/userinfo", getUserinfo);


router.get("/auth/logout",(req, res) => {
    try {
        if (req.isAuthenticated()) {
            // For session-based authentication (Google OAuth + Passport)
            req.logout(function (err) {
                if (err) return res.status(500).json({ message: "Logout failed" });

                req.session.destroy(() => {
                    res.clearCookie("token"); // Clear session cookie
                    return res.status(200).json({ message: "Logged out successfully" });
                });
            });
        } else if (!req.isAuthenticated()) {
            // For JWT-based authentication (Normal login with token)
            res.clearCookie("token");
            res.status(200).json({ message: "Logged out successfully" });
        } else {
            return res.status(400).json({ message: "User not logged in" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error during logout" });
    }
});
  
  module.exports = router;
