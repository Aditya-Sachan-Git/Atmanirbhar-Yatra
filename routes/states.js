const express = require('express')
var state = require('../usermodel/states')
const City = require('../usermodel/city')
const router = express.Router();
const mw = require('../mw/route')
router.get('/states',mw.login,async (req,res)=>{
    const states = await state.find();
    res.render('states',{states})
})
router.post('/states',async (req,res)=>{
    

    const stateIds = [].concat(req.body.selectedStates || []);

    const cities = await City.find({ stateId: { $in: stateIds } });
    res.render('showCity',{cities});
    
})


module.exports = router;