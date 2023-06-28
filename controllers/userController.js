const { User, Thought } = require('../models');

module.exports = {
  // Get all courses
  async getUser(req, res) {
    try {
      const Users = await User.find();
      res.json(Users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get a course
  async getSingleUser(req, res) {
    try {
      const User = await User.findOne({ _id: req.params.UserId })
        .select('-__v');

      if (!User) {
        return res.status(404).json({ message: 'No User with that ID' });
      }

      res.json(User);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Create a course
  async createUser(req, res) {
    try {
      const User = await User.create(req.body);
      res.json(User);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Delete a course
  async deleteUser(req, res) {
    try {
      const User = await User.findOneAndDelete({ _id: req.params.UserId });

      if (!User) {
        return res.status(404).json({ message: 'No User with that ID' });
      }

      await Thought.deleteMany({ _id: { $in: User.Thoughts } });
      res.json({ message: 'User and Thoughts deleted!' });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Update a course
  async updateUser(req, res) {
    try {
      const User = await User.findOneAndUpdate(
        { _id: req.params.UserId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!User) {
        return res.status(404).json({ message: 'No User with this id!' });
      }

      res.json(User);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
