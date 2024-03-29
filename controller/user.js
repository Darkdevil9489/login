const mysql = require('mysql');
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");
const { promisify } = require("util");


const connect = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password:'',
    database:'test'
    })
    
exports.register =(req,res)=>{
    // console.log(req.body)
    const{name,email,password,confirm_password}=req.body;
    // console.log(name)
    // console.log(email)
    // console.log(password)
    // console.log(confirm_password)

connect.query('select email from user where email=?',[email],async(err,result)=>{
    if(err){
        console.log(err);
    }
    if(result.length>0){
return res.status(200).render('register',{
    msg: "Email id already Taken",
    msg_type: "error",
})
    }else if(password !== confirm_password){
        return res.status(200).render('register',{
            msg:"password is wrong",
            msg_type:"error"
        })
    }

let hashedPassword = await bcrypt.hash(password, 8);
console.log(hashedPassword)
connect.query("insert into user set ?",
{ name: name, email: email, pass: hashedPassword },(err,result)=>{
    if(err){
        console.log(err)
    }else{
        return res.status(200).render("register", {
            msg: "User Registration Success",
            msg_type: "good",
          });
    }
})
})
}
exports.login = async(req,res)=>{
  try{
const {email,password} =req.body
if(!email || !password){
  return res.render('login',{
    msg:'plese enter email and password',
    msg_type:'error'
  })
}
  connect.query('select * from user where email=?',[email],async(err,result)=>{
   if(result.length <= 0){
    return res.render('login',{
      msg:'plese enter valid email and password',
      msg_type:'error'
    })
   }else{
    if(!(await bcrypt.compare(password,result[0].pass))){
      return res.render('login',{
        msg:'plese enter valid email and password',
        msg_type:'error'
      })
    }else{
     
      const id = result[0].ID;
// console.log(id)
      const token = jwt.sign({id:id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
      })
      const cookieOptions = {
    expires: new Date(
      Date.now() +
        process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };  
  res.cookie("ashok", token, cookieOptions)
  res.status(200).redirect("/home"); 
    }
   }
  })
  }catch(err){
    console.log(err)
  }
}

  exports.isLoggedIn = async(req,res,next)=>{
    // req.name = "Check Login....";
    // console.log(req.cookies);
    if(req.cookies.ashok){
      try{
const decode = await promisify(jwt.verify)(
  req.cookies.ashok,
  process.env.JWT_SECRET);

  

// console.log(decode);

connect.query('select * from user where id=?',[decode.id],async(err,result)=>{
  // console.log(result)
 if(!result){
  return next()
 }
 req.user= result[0];
 return next()
})
      }catch(err){
console.log(err)
return next();
      }
    }else{
      return next()
    }
  };

  exports.logout = async (req, res) => {
    res.cookie("ashok", "logout", {
      expires: new Date(Date.now() + 2 * 1000),
      httpOnly: true,
    });
    res.status(200).redirect("/login");
  }