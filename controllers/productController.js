import Product from "../models/product.js"

export function getProduct(req, res) {
    Product.find()
        .then(products => {
            res.status(200).json({
                message: "Products retrieved successfully",
                products: products
            })
        }
        )
        .catch(err => {
            res.status(500).json({
                message: "Error retrieving products",
                error: err.message
            })
        })
}

export async function createProduct(req, res) {
    if(req.user == null ){
        res.status(401).json({
            message:"You need to login to create a product"
        })
        return
    }

    if(req.user.role != "admin"){
        res.status(403).json({
            message:"You don't have permission to create a product"
        })
        return
    }

    const product = new Product(req.body)
    try{
        await product.save()
        res.status(200).json({
            message:"Product created successfully"
        })

    }catch(err){
        res.status(500).json({
            message:"Error creating product",
            error:err.message
        })
        return
    }
    
  
}

export function updateProduct(req, res) {
    if(req.user == null ){
        res.status(401).json({
            message:"You need to login to update a product"
        })
        return
    }
    if(req.user.role != "admin"){
        res.status(403).json({
            message:"You don't have permission to update a product"
        })
        return
    }
    Product.findOneAndUpdate({
        productId:req.params.productId
    },req.body)
    .then(()=>{
        res.status(200).json({
            message:"Product Updated Successfully"
        })

    })

    .catch(err=>{
        res.status(500).json({
            message:"Error updating product",
            error:err.message
        })
    })

}

export function deleteProduct(req, res) {
    if(req.user == null ){
        res.status(401).json({
            message:"You need to login to delete a product"
        })
        return
    }
    Product.findOneAndDelete({
        productId:req.params.productId
    }).then(()=>{
        res.status(200).json({
            message:"Product deleted successfully"
        })
    }).catch(err=>{
        res.status(500).json({
            message:"Error deleting product",
            error:err.message
        })
    })

}