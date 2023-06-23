const { Schema, model } = require('mongoose');

// schema is incomplete- this is just the bones. need to fill it in proper
// maybe wait for sam to push the solved so i can see whats wrong
// with the tags section since thats part of the student file i got this from
// lol
const UserSchema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'thoughts'
        }
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'friends'
        }
    ]
},
    {
        toJSON: {
            virtuals: true
        },
        id: false
    }
);

UserSchema.virtual('postCount').get(function () {
return this.posts.length;
});

const Reaction = model('reaction', UserSchema);