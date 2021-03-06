const express=require('express');
const router=express.Router();
const bcrypt=require('bcrypt');
const Joi=require('@hapi/joi');
const {User}=require('../models/user');


router.post('/',async(req,res)=>{
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user=await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send('invalid email or password');
    if(user.disabled) return res.status(400).send('OOPS! unfortunatly your account has been disabled');

    const isValid=await bcrypt.compare(req.body.password,user.password);
    if(!isValid) return res.status(400).send('invalid email or password');
    const token=user.generateAuthToken();
    res.send(token);
});

function validate(req) {
    const schema = Joi.object({
      email: Joi.string().min(5).max(255).required().email(),
      password: Joi.string().min(5).max(255).required()
    });
  
    return schema.validate(req);
}

module.exports=router;



