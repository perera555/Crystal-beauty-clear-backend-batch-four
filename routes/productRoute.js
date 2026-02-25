import express from "express";
import { createProduct, deleteProduct, getProduct, updateProduct, } from "../controllers/productController.js";

const prodductRouter = express.Router();


prodductRouter.get("/",getProduct)

prodductRouter.post("/",createProduct)

prodductRouter.delete("/:productId",deleteProduct)

prodductRouter.put("/:productId",updateProduct)



export default prodductRouter;