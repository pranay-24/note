const express = require('express')
const bcrypt = require('bcryptjs');

const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');


const JWT_SECRET = 'Harryisagood$oy'
var jwt = require('jsonwebtoken');

//create user using POST "/api/auth/createuser"
router.post('/createuser', [
    body('email','enter a valid email').isEmail(),
    body('name','enter a valid name').isLength({ min: 3}),
    body('password','enter a valid password' ).isLength({ min: 5})
], async(req,res)=>{

    // if errors return bad request and errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }


    try {
// check whether the user email  exist allready 
let user =await User.findOne({email : req.body.email})

if (user)
{return res.status(400).json({error:"sry user already exist"})}

const salt= await bcrypt.genSalt(10);
const secpassword =await bcrypt.hash(req.body.password, salt) ;

   user = await   User.create({
        name: req.body.name,
        email: req.body.email,
        password: secpassword
      })
      
   
    //   .then(user => res.json(user))
    //   .catch(err=>{console.log(err)
    // res.json({error:'Plsease enter unique value for email',message:err.message})
    // })

    const data={
        user:{
            id: user.id
        }
    }
    const authtoken= jwt.sign(data, JWT_SECRET);
    // console.log(jwtData);
    
    // res.json(user);
    res.json({authtoken})

    
}catch(error)
{console.error(error.message);
    //   res.status[500]
  res.status(500).send("some error occured")}
})
module.exports = router