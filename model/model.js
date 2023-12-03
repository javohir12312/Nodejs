const mongoose = require("mongoose")
const Schema = require("schema")


const blogSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  image:{
    type:Buffer,
    required: true
  },
},{timestamps:true});

const Blog = mongoose.model("Blog",blogSchema)
module.exports = Blog  
