const Nutrition = require("../models/Nutrition");

// @desc    Get all nutrition entries for logged in user
// @route   GET /api/nutrition
// @access  Private
const getNutritionEntries = async (req, res) => {
  try {
    const { date } = req.query;
    const query = { user: req.user._id };

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    const entries = await Nutrition.find(query).sort({ date: -1 });
    return res.json(entries);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single nutrition entry
// @route   GET /api/nutrition/:id
// @access  Private
const getNutritionById = async (req, res) => {
  try {
    const entry = await Nutrition.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!entry) {
      return res.status(404).json({ message: "Nutrition entry not found" });
    }

    return res.json(entry);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Create a nutrition entry
// @route   POST /api/nutrition
// @access  Private
const createNutritionEntry = async (req, res) => {
  try {
    const { mealName, mealType, calories, macros, date } = req.body;

    if (!mealName || calories === undefined) {
      return res
        .status(400)
        .json({ message: "Meal name and calories are required" });
    }

    const entry = await Nutrition.create({
      user: req.user._id,
      mealName,
      mealType,
      calories,
      macros,
      date,
    });

    return res.status(201).json(entry);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update a nutrition entry
// @route   PUT /api/nutrition/:id
// @access  Private
const updateNutritionEntry = async (req, res) => {
  try {
    const entry = await Nutrition.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!entry) {
      return res.status(404).json({ message: "Nutrition entry not found" });
    }

    Object.assign(entry, req.body);
    const updated = await entry.save();

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a nutrition entry
// @route   DELETE /api/nutrition/:id
// @access  Private
const deleteNutritionEntry = async (req, res) => {
  try {
    const entry = await Nutrition.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!entry) {
      return res.status(404).json({ message: "Nutrition entry not found" });
    }

    return res.json({ message: "Nutrition entry removed" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getNutritionEntries,
  getNutritionById,
  createNutritionEntry,
  updateNutritionEntry,
  deleteNutritionEntry,
};
