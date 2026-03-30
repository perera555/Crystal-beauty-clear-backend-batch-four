import express from "express"

import {
  createProduct,
  deleteProduct,
  getProduct,
  getProductById,
  searchProduct,
  updateProduct
} from "../controllers/productController.js"

const productRouter = express.Router()



// GET ALL PRODUCTS
productRouter.get("/", getProduct)


// SEARCH PRODUCTS
productRouter.get("/search/:id", searchProduct)


// GET SINGLE PRODUCT BY ID
productRouter.get("/:id", async (req, res, next) => {

  try {

    const { id } = req.params

    if (!id) {
      return res.status(400).json({
        message: "Product ID is required"
      })
    }

    req.params.id = id
    next()

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    })

  }

}, getProductById)


// CREATE PRODUCT
productRouter.post("/", createProduct)


// DELETE PRODUCT
productRouter.delete("/:productId", deleteProduct)


// UPDATE PRODUCT
productRouter.put("/:productId", updateProduct)



export default productRouter