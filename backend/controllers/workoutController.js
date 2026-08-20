const Workout = require("../models/Workout");

// @desc    Get all workouts for logged in user
// @route   GET /api/workouts
// @access  Private
const getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id }).sort({
      date: -1,
    });
    return res.json(workouts);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single workout
// @route   GET /api/workouts/:id
// @access  Private
const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    return res.json(workout);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new workout
// @route   POST /api/workouts
// @access  Private
const createWorkout = async (req, res) => {
  try {
    const {
      title,
      category,
      exercises,
      durationMin,
      caloriesBurned,
      intensity,
      completed,
      date,
    } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Workout title is required" });
    }

    const workout = await Workout.create({
      user: req.user._id,
      title,
      category,
      exercises,
      durationMin,
      caloriesBurned,
      intensity,
      completed,
      date,
    });

    return res.status(201).json(workout);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update a workout
// @route   PUT /api/workouts/:id
// @access  Private
const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    Object.assign(workout, req.body);
    const updated = await workout.save();

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a workout
// @route   DELETE /api/workouts/:id
// @access  Private
const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!workout) {
      return res.status(404).json({ message: "Workout not found" });
    }

    return res.json({ message: "Workout removed" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
};
