const User = require("../models/User");
const Workout = require("../models/Workout");
const Nutrition = require("../models/Nutrition");
const generateToken = require("../utils/generateToken");

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      goals: user.goals,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      goals: user.goals,
      token: generateToken(user._id),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Update logged in user's profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.avatar = req.body.avatar || user.avatar;

    if (req.body.goals) {
      user.goals = { ...user.goals.toObject(), ...req.body.goals };
    }

    if (req.body.stats) {
      user.stats = { ...user.stats.toObject(), ...req.body.stats };
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    return res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      goals: updatedUser.goals,
      stats: updatedUser.stats,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get aggregated dashboard stats for logged in user
// @route   GET /api/users/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [weeklyWorkouts, todaysMeals] = await Promise.all([
      Workout.find({ user: userId, date: { $gte: startOfWeek } }).sort({
        date: 1,
      }),
      Nutrition.find({ user: userId, date: { $gte: startOfDay } }),
    ]);

    const caloriesBurnedToday = weeklyWorkouts
      .filter((w) => new Date(w.date) >= startOfDay)
      .reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);

    const caloriesEatenToday = todaysMeals.reduce(
      (sum, m) => sum + (m.calories || 0),
      0
    );

    const activityByDay = [0, 0, 0, 0, 0, 0, 0];
    weeklyWorkouts.forEach((w) => {
      const dayIndex = new Date(w.date).getDay();
      activityByDay[dayIndex] += w.durationMin || 0;
    });

    return res.json({
      weeklyWorkoutCount: weeklyWorkouts.length,
      caloriesBurnedToday,
      caloriesEatenToday,
      activityByDay,
      recentWorkouts: weeklyWorkouts.slice(-5).reverse(),
      todaysMeals,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getDashboardStats,
};
