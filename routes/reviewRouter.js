import express from "express"
import {
  createReview,
  getAllReviews,
  getReviewsByProduct,
  deleteReview
} from "../controllers/reviewController.js"

const router = express.Router()

// CREATE
router.post("/", createReview)

// ✅ IMPORTANT FIX
router.get("/", getAllReviews)

// PRODUCT REVIEWS
router.get("/:productId", getReviewsByProduct)

// DELETE
router.delete("/:id", deleteReview)

export default router