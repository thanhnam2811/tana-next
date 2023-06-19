async function getAllPostWithPrivacy(listPosts, req) {
	try {
		const posts = [];
		listPosts.forEach((post) => {
			if (req.user && req.user._id.toString() === post.author._id.toString()) {
				posts.push(post);
				return;
			}
			// check fields have privacy or not
			if (post.privacy) {
				if (post.privacy.value === 'public') {
					posts.push(post);
				} else if (post.privacy.value === 'private') {
					post = null;
				} else if (post.privacy.value === 'friends') {
					const isFriend = post.author.friends.some(
						(friend) => friend.user.toString() === req.user._id.toString()
					);
					if (isFriend) {
						posts.push(post);
					}
				} else if (post.privacy.value === 'includes') {
					if (
						!post.privacy.includes.some((user) => user._id == req.user._id) &&
						post.author.friends.some((friend) => friend.user.toString() === req.user._id.toString())
					) {
						post = null;
						return;
					}
					posts.push(post);
				} else if (post.privacy.value === 'excludes') {
					if (
						!post.privacy.excludes.some((user) => user._id.toString() == req.user._id.toString()) &&
						post.author.friends.some((friend) => friend.user.toString() === req.user._id.toString())
					) {
						posts.push(post);
						return;
					}
					post = null;
				}
			}
		});
		return posts;
	} catch (error) {
		console.log(error);
	}
}

async function getPostWithPrivacy(post, req) {
	try {
		if (req.user._id.toString() === post.author._id.toString()) {
			return post;
		}

		if (post.privacy) {
			if (post.privacy.value === 'public') {
				return post;
			}
			if (post.privacy.value === 'private') {
				post = null;
				return post;
			}
			if (post.privacy.value === 'friends') {
				const isFriend = post.author.friends.some(
					(friend) => friend.user.toString() === req.user._id.toString()
				);
				if (!isFriend) {
					post = null;
					return post;
				}
			} else if (post.privacy.value === 'includes') {
				if (
					!post.privacy.includes.some((user) => user._id.toString() == req.user._id.toString()) &&
					post.author.friends.some((friend) => friend.user.toString() === req.user._id.toString())
				) {
					post = null;
					return post;
				}
			} else if (post.privacy.value === 'excludes') {
				if (
					!post.privacy.excludes.some((user) => user._id.toString() == req.user._id.toString()) &&
					post.author.friends.some((friend) => friend.user.toString() === req.user._id.toString())
				) {
					return post;
				}
				post = null;
			}
		}
		return post;
	} catch (error) {
		console.log(error);
	}
}

module.exports = {
	getAllPostWithPrivacy,
	getPostWithPrivacy,
};
