import Product from "../models/product.js"



export function getProduct(req, res) {

    Product.find()
        .then(products => {

            res.status(200).json({
                message: "Products retrieved successfully",
                products: products
            })

        })
        .catch(err => {

            res.status(500).json({
                message: "Error retrieving products",
                error: err.message
            })

        })

}



export async function getProductById(req, res) {

    const productId = req.params.id

    try {

        // first search using productId field
        let product = await Product.findOne({ productId: productId })

        // if not found, search using MongoDB _id
        if (!product) {

            product = await Product.findById(productId)

        }

        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            })

        }

        res.status(200).json({
            product: product
        })

    } catch (error) {

        res.status(500).json({
            message: "Error retrieving product",
            error: error.message
        })

    }

}



export async function createProduct(req, res) {

    if (req.user == null) {

        res.status(401).json({
            message: "You need to login to create a product"
        })

        return

    }

    if (req.user.role != "admin") {

        res.status(403).json({
            message: "You don't have permission to create a product"
        })

        return

    }

    const product = new Product(req.body)

    try {

        await product.save()

        res.status(200).json({
            message: "Product created successfully",
            product: product
        })

    } catch (err) {

        res.status(500).json({
            message: "Error creating product",
            error: err.message
        })

    }

}



export function updateProduct(req, res) {

    if (req.user == null) {

        res.status(401).json({
            message: "You need to login to update a product"
        })

        return

    }

    if (req.user.role != "admin") {

        res.status(403).json({
            message: "You don't have permission to update a product"
        })

        return

    }

    Product.findOneAndUpdate(
        { productId: req.params.productId },
        req.body,
        { new: true }
    )

        .then(updatedProduct => {

            if (!updatedProduct) {

                res.status(404).json({
                    message: "Product not found"
                })

                return

            }

            res.status(200).json({
                message: "Product Updated Successfully",
                product: updatedProduct
            })

        })

        .catch(err => {

            res.status(500).json({
                message: "Error updating product",
                error: err.message
            })

        })

}



export function deleteProduct(req, res) {

    if (req.user == null) {

        res.status(401).json({
            message: "You need to login to delete a product"
        })

        return

    }

    if (req.user.role != "admin") {

        res.status(403).json({
            message: "You don't have permission to delete a product"
        })

        return

    }

    Product.findOneAndDelete({
        productId: req.params.productId
    })

        .then(deletedProduct => {

            if (!deletedProduct) {

                res.status(404).json({
                    message: "Product not found"
                })

                return

            }

            res.status(200).json({
                message: "Product deleted successfully",
                product: deletedProduct
            })

        })

        .catch(err => {

            res.status(500).json({
                message: "Error deleting product",
                error: err.message
            })

        })

}



export async function searchProduct(req, res) {

    const search = req.params.id

    try {

        const products = await Product.find({

            $or: [

                { name: { $regex: search, $options: "i" } },
                { altNames: { $elemMatch: { $regex: search, $options: "i" } } }

            ]

        })

        res.json({
            products: products
        })

    } catch (err) {

        res.status(500).json({
            message: "Error in Searching product"
        })

    }

}