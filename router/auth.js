const express = require('express');
const usercontroller = require('../controller/user')
const router =express.Router();


router.post('/register',usercontroller.register)
router.all('/login',usercontroller.login)
module.exports=router;