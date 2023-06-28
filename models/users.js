const { Schema, model } = require('mongoose');

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