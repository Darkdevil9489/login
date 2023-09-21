const express = require('express')
const route = express.Router();
const usercontroller = require('../controller/user');

route.get(["/", "/login"],(req,res)=>{
    res.status(200).render('login')
})

route.get('/register',(req,res)=>{
    res.render('register')
})
route.get("/profile", usercontroller.isLoggedIn, (req, res) => {
    if (req.user) {
      res.render("profile", { user: req.user });
    } else {
      res.redirect("/login");
    }
  });
  route.get("/home", usercontroller.isLoggedIn, (req, res) => {
    //console.log(req.name);
    if (req.user) {
      res.render("home", { user: req.user });
    } else {
      res.redirect("/login");
    }
  });
route.use((req,res)=>{
    res.render('error')
})

module.exports=route;