const Conversation = require('../../app/models/Conversation');

exports.populateConversation = async (conversationID) => {
    const conversation = await Conversation.findById(conversationID)
        .populate({
            path: 'lastest_message',
            populate: {
                path: 'sender',
                select: '_id fullname profilePicture isOnline',
                populate: {
                    path: 'profilePicture',
                    select: '_id link'
                }
            }
        })
        .populate({
            path: 'members.user',
            select: '_id fullname profilePicture isOnline',
            populate: {
                path: 'profilePicture',
                select: '_id link'
            }
        })
        .populate({
            path: 'members.addedBy',
            select: '_id fullname profilePicture isOnline',
            populate: {
                path: 'profilePicture',
                select: '_id link'
            }
        })
        .populate({
            path: 'members.changedNicknameBy',
            select: '_id fullname profilePicture isOnline',
            populate: {
                path: 'profilePicture',
                select: '_id link'
            }
        })
        .populate({
            path: "avatar",
            select: "_id link"
        })
        .populate({
            path: 'creator',
            select: '_id fullname profilePicture isOnline',
            populate: {
                path: 'profilePicture',
                select: '_id link'
            }
        })
        .populate({
            path: 'creator',
            select: '_id fullname profilePicture isOnline',
            populate: {
                path: 'profilePicture',
                select: '_id link'
            }
        });
    return conversation;
}

