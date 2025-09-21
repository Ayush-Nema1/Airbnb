const User = require("../models/user.js");

module.exports.Signuppage = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res)=>{
    try{
    let {username , email, password} = req.body;
    const newUser = new User({email,username});
    const registerUser = await User.register(newUser,password);
    console.log(registerUser);
    req.login(registerUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome you are logged in ");
        res.redirect("/listings");
    });
    
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

module.exports.loginPage = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>{
req.flash("success","welcome to Wanderlust! You are logged in");
let redirectUrl  = res.locals.redirectUrl;
if(redirectUrl){
res.redirect(redirectUrl);
}else{
    res.redirect("/listings");
}
};
module.exports.logout = (req,res,next)=>{
    req.logOut((err)=>{
        if(err) {
            return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    });
};