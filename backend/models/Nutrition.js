const mongoose = require("mongoose");

const nutritionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    mealName: {
      type: String,
      required: [true, "Meal name is required"],
      trim: true,
    },
    mealType: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
      default: "Snack",
    },
    calories: {
      type: Number,
      required: true,
      default: 0,
    },
    macros: {
      carbsG: { type: Number, default: 0 },
      proteinG: { type: Number, default: 0 },
      fatsG: { type: Number, default: 0 },
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Nutrition", nutritionSchema);
