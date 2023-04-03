let mongoose = require("mongoose")
let dbConnect = require('./dbConnect')
dbConnect();

let blogSchema = mongoose.Schema({
    title:String,
    image:String,
    disc:String,
    date:String,
})

module.exports = blogSchema;