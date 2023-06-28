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

ThoughtSchema.virtual('reactionCount').get(function () {
return this.reactions.length;
});

const Reaction = model('reaction', ThoughtSchema);