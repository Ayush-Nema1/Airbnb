const express= require("express");
const app = express();
const session = require("express-session");
const flash = require("connect-flash");

const sessionOptions = {secret: "mysuperseceretcode",
    resave:false,
    saveUninitialized:true,
};

app.use(session(sessionOptions));

app.get("/testcount",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }else{
        req.session.count = 1;
    }
    res.send(`test successful coun ${req.session.count}`);
});

app.listen(3000,()=>{
    console.log("server is listenung");
});