let mongoose = require('mongoose');
let url = "mongodb://127.0.0.1:27017/test5";

let dbConnect = async()=>{
    mongoose.connect(url);
}

module.exports=dbConnect;