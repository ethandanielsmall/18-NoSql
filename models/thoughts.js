const { Schema, model } = require('mongoose');

// schema is incomplete- this is just the bones. need to fill it in proper
// maybe wait for sam to push the solved so i can see whats wrong
// with the tags section since thats part of the student file i got this from
// lol
const ThoughtSchema = new Schema(
    {
        createdAt: {
          type: Date,
          default: Date.now,
        },
        tags: [
          {
            type: 'Tag',
            ref: 'Tag',
          },
        ],
        text: {
          type: String,
          minLength: 15,
          maxLength: 500,
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