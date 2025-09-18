const express = require("express");
const router = express.Router( );
const User = require("../models/user.js");
const wrapAsyns =  require("../utils/wrapAsync.js");
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsyns( async(req,res)=>{
    try{
    let {username , email, password} = req.body;
    const newUser = new User({email,username});
    const registerUser = await User.register(newUser,password);
    console.log(registerUser);
    req.flash("success","welcome to wanderlust");
    res.redirect("/listings");
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})

module.exports = router;