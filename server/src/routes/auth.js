const router = require('express').Router();
const passport = require('passport');
const AuthoController = require('../app/controllers/AuthController');

// Login by Google
router.get(
	'/google',
	passport.authenticate('google', {
		scope: ['profile', 'email'],
	})
);
router.get(
	'/google/callback',
	passport.authenticate('google', { failureRedirect: '/login' }),
	AuthoController.loginGoogle
);
// Login by Github
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get(
	'/github/callback',
	passport.authenticate('github', { failureRedirect: '/login' }),
	AuthoController.loginGithub
);

router.get('/verify/:userId/:token', AuthoController.verify);

// REFRESH ACCESS_TOKEN
router.post('/refresh', AuthoController.refreshToken);

// REGISTER
router.post('/register', AuthoController.register);

// LOGIN
router.post('/login', AuthoController.login);

// Get link forgot password
router.post('/password-reset', AuthoController.sendLinkForgottenPassword);

// Reset password from link
router.post('/password-reset/:userId/:token', AuthoController.resetPassword);

module.exports = router;
