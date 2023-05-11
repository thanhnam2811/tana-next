const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
const { User } = require('../app/models/User');
const File = require('../app/models/File');

module.exports = function (passport) {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: '/auth/google/callback',
			},
			async (accessToken, refreshToken, profile, done) => {
				// Check if google profile exist.
				if (profile.id) {
					User.findOne({ email: profile.emails[0].value }).then(async (existingUser) => {
						if (existingUser) {
							done(null, existingUser);
						} else {
							var avatar = null;
							if (profile.photos[0].value) {
								avatar = await File.create({
									name: profile.displayName,
									type: 'image',
									link: profile.photos[0].value,
								});
							}
							//create new user
							const newUser = new User({
								email: profile.emails[0].value,
								fullname: profile.displayName,
								profilePicture: avatar?._id,
							});
							//update file creator
							if (avatar) {
								await File.findByIdAndUpdate(avatar._id, {
									creator: newUser._id,
								});
							}
							const user = await newUser.save();
							done(null, user);
						}
					});
				} else {
					done(null, false);
				}
			}
		)
	);

	//passport for Github
	passport.use(
		new GithubStrategy(
			{
				clientID: process.env.GITHUB_CLIENT_ID,
				clientSecret: process.env.GITHUB_CLIENT_SECRET,
				callbackURL: '/auth/github/callback',
				proxy: true,
				scope: ['user:email'],
			},
			async (accessToken, refreshToken, profile, done) => {
				// Check if github profile exist.
				if (profile.id) {
					User.findOne({ email: profile.emails[0].value }).then(async (existingUser) => {
						if (existingUser) {
							done(null, existingUser);
						} else {
							var avatar = null;
							if (profile.photos[0].value) {
								avatar = await File.create({
									name: profile.displayName,
									type: 'image',
									link: profile.photos[0].value,
								});
							}
							//create new user
							const newUser = new User({
								email: profile.emails[0].value,
								fullname: profile.displayName,
								profilePicture: avatar?._id,
							});
							//update file creator
							if (avatar) {
								await File.findByIdAndUpdate(avatar._id, {
									creator: newUser._id,
								});
							}
							const user = await newUser.save();
							done(null, user);
						}
					});
				} else {
					done(null, false);
				}
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id, done) => {
		User.findById(id, (err, user) => done(err, user));
	});
};
