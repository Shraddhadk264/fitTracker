const express = require("express");
const router = express.Router();
const {
  getNutritionEntries,
  getNutritionById,
  createNutritionEntry,
  updateNutritionEntry,
  deleteNutritionEntry,
} = require("../controllers/nutritionController");
const { protect } = require("../middleware/authMiddleware");

router
  .route("/")
  .get(protect, getNutritionEntries)
  .post(protect, createNutritionEntry);

router
  .route("/:id")
  .get(protect, getNutritionById)
  .put(protect, updateNutritionEntry)
  .delete(protect, deleteNutritionEntry);

module.exports = router;
