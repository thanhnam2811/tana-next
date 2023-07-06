const List = require('../../app/models/List');

// Define the checkBadWord function
async function checkBadWord(content) {
	const listBadWords = await List.findOne({
		key: 'bad-word',
	});
	const bannedWords = listBadWords.items ?? [];
	const lowerCaseContent = content.toLowerCase();

	for (const word of bannedWords) {
		if (lowerCaseContent.includes(word.toLowerCase())) {
			return true;
		}
	}

	return false;
}

// Export the instance
module.exports = {
	checkBadWord,
};
