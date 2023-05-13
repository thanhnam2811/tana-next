const mongoose = require("mongoose");
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const ReactSchema = new mongoose.Schema(
    {
        //create 6 type of reaction for post, comment, message
        type: {
            type: String,
            enum: ['like', 'love', 'haha', 'wow', 'sad', 'angry'],
            default: 'like',
            required: true,
        },
        //user react
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
        //postid
        post: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Post'
        },
        //commentid
        comment: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Comment'
        },
        //messageid
        message: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Message'
        },
    },
    { timestamps: true }
);

//soft delete
ReactSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

//paginate
ReactSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("React", ReactSchema);