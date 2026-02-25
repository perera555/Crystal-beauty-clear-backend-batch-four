import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productId:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    altNames:{
        type:[String],
        default:[]
    },
    price:{
        type:Number,
        required:true
    },
    labeledPrice:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    images:{
        type:[String],
        required:true,
        default:["https://t4.ftcdn.net/jpg/02/73/55/33/360_F_273553300_sBBxIPpLSn5iC5vC8FwzFh6BJDKvUeaC.jpg"]
    },
    stock:{
        type:Number,
        required:true,
    }
})
const Product = mongoose.model("products",productSchema)
export default Product;