import Review from "../models/review.js"

export const createReview = async (req, res) => {
  try {
    let { productId, customerName, rating, comment } = req.body

    rating = Number(rating)

    if (!productId || !customerName || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" })
    }

    let image = null
    if (req.file) image = req.file.path

    const review = new Review({
      productId,
      customerName,
      rating,
      comment,
      image
    })

    const savedReview = await review.save()

    res.status(201).json({
      message: "Review added successfully",
      review: savedReview
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: error.message || "Error creating review"
    })
  }
}

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 })
    res.status(200).json({ reviews })
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews" })
  }
}

export const getReviewsByProduct = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId })
    res.status(200).json({ reviews })
  } catch {
    res.status(500).json({ message: "Error fetching reviews" })
  }
}

export const deleteReview = async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id)
    res.json({ message: "Deleted" })
  } catch {
    res.status(500).json({ message: "Error deleting review" })
  }
}