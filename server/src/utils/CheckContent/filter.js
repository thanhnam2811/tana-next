const BadWord = require('../../app/models/BadWord');

// Define the checkBadWord function
async function checkBadWord(content) {
	const badwords = await BadWord.find();
	const bannedWords = badwords.reduce((result, item) => result.concat(item.words), []);

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
