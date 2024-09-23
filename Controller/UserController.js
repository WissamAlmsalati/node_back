
const jwt = require('jsonwebtoken');
const User = require("../Models/User");



const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};





exports.createUser = async (req, res) => {
  try {
    const { UserName, email, password } = req.body;

    if (!UserName || !email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide UserName, email, and password.',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: 'fail',
        message: 'Email already in use.',
      });
    }

    const newUser = await User.create({
      UserName,
      email,
      password,
    });
    
    const token = signToken(newUser._id);
      
    newUser.token = token;
    await newUser.save();

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    //empty
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide email and password!',
      });
    }
    
 
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password',
      });
    }

    res.status(200).json({
      id: user._id,
      UserName: user.UserName,
      email: user.email,
      token:user.token,
   // data: {
      //   user,
      // },
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message,
    });
  }
};


exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "No user found with that ID.",
      });
    }
    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
exports.updateUserById = async (req, res) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      res.status(400).json({ message: 'Error updating user', error: error.message });
    }
  };
  
  // Delete a user by ID
  exports.deleteUserById = async (req, res) => {
    try {
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
  };
