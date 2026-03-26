const mongoose = require('mongoose')
const config = require('config')
mongoose.connect(`${config.get("mongodb_uri")}/newdatabse`)
.then(()=>{
    console.log("database connected")
})
.catch((err)=>{
    console.log(err)
})
module.exports = mongoose.connection;