// ObjectId() method for converting studentId string into an ObjectId for querying database
const { ObjectId } = require('mongoose').Types;
const { Thought, Users } = require('../models');

// TODO: Create an aggregate function to get the number of students overall
const headCount = async () => {
  const numberOfThoughts = await Thought.countDocuments();
  return numberOfThoughts;
}

// Execute the aggregate method on the Thought model and calculate the overall grade by using the $avg operator
const grade = async (ThoughtId) =>
  Thought.aggregate([
    // TODO: Ensure we include only the student who can match the given ObjectId using the $match operator
    {
      $match: {
        _id: ObjectId(ThoughtId),
      },
    },
    {
      $unwind: '$assignments',
    },
    // TODO: Group information for the student with the given ObjectId alongside an overall grade calculated using the $avg operator
    {
      $group: {
        _id: '$_id',
        overallGrade: { $avg: '$assignments.grade' },
      },
    },
  ]);

module.exports = {
  // Get all students
  async getThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      const thoughtObj = {
        thoughts,
        headCount: await headCount(),
      };
      return res.json(thoughtObj);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Get a single student
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.ThoughtId })
        .select('-__v')
        .lean();

      if (!thought) {
        return res.status(404).json({ message: 'No Thought with that ID' });
      }

      res.json({
        thought,
        grade: await grade(req.params.ThoughtId),
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // create a new student
  async createThought(req, res) {
    try {
      const thought = await Thought.create(req.body);
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete a student and remove them from the course
  async deleteThought(req, res) {
    try {
      const thought = await Thought.findOneAndRemove({ _id: req.params.ThoughtId });

      if (!thought) {
        return res.status(404).json({ message: 'No such Thought exists' })
      }

      const user = await Users.findOneAndUpdate(
        { thoughts: req.params.ThoughtId },
        { $pull: { thoughts: req.params.ThoughtId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: 'Thought deleted, but no Users found',
        });
      }

      res.json({ message: 'Thought successfully deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Add an assignment to a student
  async addAssignment(req, res) {
    try {
      console.log('You are adding an assignment');
      console.log(req.body);
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.ThoughtId },
        { $addToSet: { assignments: req.body } },
        { runValidators: true, new: true }
      );

      if (!Thought) {
        return res
          .status(404)
          .json({ message: 'No Thought found with that ID :(' });
      }

      res.json(Thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
