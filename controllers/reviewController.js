import Review from "../models/review.js"

// CREATE REVIEW
export const createReview = async (req, res) => {
  try {
    const { productId, customerName, rating, comment } = req.body

    if (!productId || !customerName || !rating || !comment) {
      return res.status(400).json({
        message: "All fields are required"
      })
    }

    const review = new Review({
      productId,
      customerName,
      rating,
      comment
    })

    const savedReview = await review.save()

    res.status(201).json({
      message: "Review added successfully",
      review: savedReview
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Error creating review"
    })
  }
}


// ✅ GET ALL REVIEWS
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 })

    res.status(200).json({
      reviews
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Error fetching all reviews"
    })
  }
}


// GET REVIEWS BY PRODUCT
export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params

    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 })

    res.status(200).json({
      reviews
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Error fetching reviews"
    })
  }
}


// DELETE REVIEW
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params

    await Review.findByIdAndDelete(id)

    res.status(200).json({
      message: "Review deleted"
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Error deleting review"
    })
  }
}