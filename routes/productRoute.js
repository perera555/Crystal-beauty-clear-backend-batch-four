import express from "express";
import { createProduct, deleteProduct, getProduct, getProductById, updateProduct, } from "../controllers/productController.js";

const productRouter = express.Router();


productRouter.get("/",getProduct)
productRouter.get("/:id",getProductById)
productRouter.post("/",createProduct)
productRouter.delete("/:productId",deleteProduct)
productRouter.put("/:productId",updateProduct)



export default productRouter;