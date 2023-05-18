const Activity = require('../../app/models/Activity');

//post
async function createActivityWithPost(post, user){
    const activity = new Activity({
        type: 'post',
        content: `Bạn đã đăng một bài viết`,
        link: `/post/${post._id}`,
        target: post._id,
        user: user._id
    });
    await activity.save();
}

async function createActivityWithSharedPost(post, user){
    const activity = new Activity({
        type: 'post',
        content: `Bạn đã chia sẻ một bài viết`,
        link: `/post/${post._id}`,
        target: post._id,
        user: user._id
    });
    await activity.save();
}

async function createActivityWithReactPost(post, user){
    const activity = new Activity({
        type: 'post',
        content: `Bạn đã bày tỏ cảm xúc về một bài viết`,
        link: `/post/${post._id}`,
        target: post._id,
        user: user._id
    });
    await activity.save();
}

async function createActivityWithTagPost(post, user){
    const activity = new Activity({
        type: 'post',
        content: `Bạn đã gắn thẻ bạn bè trong một bài viết`,
        link: `/post/${post._id}`,
        target: post._id,
        user: user._id
    });
    await activity.save();
}

module.exports = {
    createActivityWithPost,
    createActivityWithSharedPost,
    createActivityWithReactPost,
    createActivityWithTagPost,
}
