const Notification = require('../../app/models/Notification');

async function notificationForFriends(post, user) {
    const friendsOfAuthor = await user.friends.map(friend => friend.user);

    const notification = new Notification({
        type: 'post',
        content: `${user.fullname} đã đăng một bài viết mới`,
        link: `/post/${post._id}`,
        sender: user._id,
        receiver: friendsOfAuthor
    });
    await notification.save();
}

async function notificationForTags(post, user) {
    const tags = post.tags;
    if (!tags || tags.length === 0) return;

    const notification = new Notification({
        type: 'post',
        content: `${user.fullname} đã gắn thẻ bạn trong một bài viết`,
        link: `/post/${post._id}`,
        sender: user._id,
        receiver: tags
    });
    await notification.save();
}

async function notificationForSharedPost(post, user) {
    const sharedPost = post.sharedPost;
    if (!sharedPost) return;

    const receiver = [sharedPost.author];

    const notification = new Notification({
        type: 'post',
        content: `${user.fullname} đã chia sẻ một bài viết của bạn`,
        link: `/post/${post._id}`,
        sender: user._id,
        receiver: receiver
    });
    await notification.save();
}

async function notificationForReactPost(post, user) {
    const receiver = [post.author];
    const notification = new Notification({
        type: 'post',
        content: `${user.fullname} đã bày tỏ cảm xúc về một bài viết của bạn`,
        link: `/post/${post._id}`,
        sender: user._id,
        receiver: receiver
    });
    await notification.save();
}

module.exports = {
    notificationForFriends,
    notificationForTags,
    notificationForSharedPost,
    notificationForReactPost
}