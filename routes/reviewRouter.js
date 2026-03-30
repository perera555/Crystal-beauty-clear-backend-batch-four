import express from "express"
import multer from "multer"
import {
  createReview,
  getAllReviews,
  getReviewsByProduct,
  deleteReview
} from "../controllers/reviewController.js"

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname)
})

const upload = multer({ storage })

router.post("/", upload.single("image"), createReview)
router.get("/", getAllReviews)
router.get("/:productId", getReviewsByProduct)
router.delete("/:id", deleteReview)

export default router