const { Schema, model } = require('mongoose');

const ThoughtSchema = new Schema(
    {
        createdAt: {
          type: Date,
          default: Date.now,
        },
        text: {
          type: String,
          minLength: 4,
          maxLength: 150,
        },
      },
    {
      toJSON: {
        virtuals: true,
      },
    }
);

const Thought = model('thought', ThoughtSchema);

module.exports = Thought;
