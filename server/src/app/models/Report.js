const mongoose = require("mongoose");
const mongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');

const ReportSchema = new mongoose.Schema(
    {
        reporter: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User'
        },
        user: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User'
        },
        post: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Post'
        },
        comment: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Comment'
        },
        reason: {
            type: String,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending'
        },
    },
    { timestamps: true }
);

//soft delete
ReportSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

//paginate
ReportSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("Report", ReportSchema);