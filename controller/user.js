const mysql = require('mysql');
const bcrypt = require("bcryptjs");

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
return res.render('register',{
    msg: "Email id already Taken",
    msg_type: "error",
})
    }else if(password !== confirm_password){
        return res.render('register',{
            msg:"password is wrong",
            msg_type:"error"
        })
    }

let hashedPassword = await bcrypt.hash(password, 8);
connect.query("insert into user set ?",
{ name: name, email: email, pass: hashedPassword },(err,result)=>{
    if(err){
        console.log(err)
    }else{
        return res.render("register", {
            msg: "User Registration Success",
            msg_type: "good",
          });
    }
})
})
}
exports.login = async(req,res)=>{
    try{
        const {email,password} = req.body

        if(!email || !password){
            return res.render('login',{
                msg:'plese enter valid email and password',
                msg_type:'error'
            })
        }
    connect.query('select * from user where email=?',[email],async(err,result)=>{
    console.log(result);
    if(result<=0){
        return res.status(401).render('login',{
            msg: "Please Enter Your Email and Password",
            msg_type: "error",
        })
    }else{
    if(!(await bcrypt.compare(password,result[0].pass))){
        return res.status(401).render('login',{
            msg: "Please Enter Your Email and Password",
            msg_type: "error",
        })
    }else{
       console.log('good')
    }
    }

    })
    }catch(err){
console.log(err)
    }
   
}