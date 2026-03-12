const state = require('../usermodel/states')
const cookieParser = require('cookie-parser')
const express = require('express')
const router = express.Router();
router.use(cookieParser());
module.exports = {
    login: async function(req,res,next){
        if(!req.cookies.token)
        {
            res.render('login');
        }
        else
        {
            let states = await state.find();
            res.render("states",{states});
        }
    }
}