const mongoose = require("mongoose");
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const CommentSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User'
        },
        content: {
            type: String,
        },
        media: [{
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'File',
            default: []
        }],
        //number react of comment
        numberReact: {
            type: Number,
            default: 0
        },
        numberReply: {
            type: Number,
            default: 0
        },
        replyTo: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Comment',
        },
        //list tags in comment
        tags: [{
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            default: []
        }],
        //postid
        post: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Post'
        },
    },
    { timestamps: true }
);

//soft delete
CommentSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

//paginate
CommentSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Comment", CommentSchema);