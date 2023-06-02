const { User, labelOfGender } = require('../models/User');
const Token = require('../models/Token');
const { sendEmail, sendEmailVerify, isEmailValid } = require('../../utils/Mail/sendMail');
const crypto = require('crypto');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const moongose = require('mongoose');
const authMethod = require('../../auth/auth.method');
const redisClient = require('../../configs/redis/index');
const createError = require('http-errors');
const moment = require('moment');
// const randToken = require('rand-Token');
const { populateUserByEmail } = require('../../utils/Populate/User');
const { default: mongoose } = require('mongoose');

const hostClient = process.env.HOST_CLIENT;
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
class AuthoController {
	//REGISTER
	async register(req, res, next) {
		try {
			const schema = Joi.object({
				password: Joi.string().required(),
				confirmPassword: Joi.string().required().valid(Joi.ref('password')),
				email: Joi.string().email().required(),
				fullname: Joi.string().required(),
				gender: Joi.object({
					value: Joi.string().valid('male', 'female', 'other').required(),
				}),
			});
			const { error } = schema.validate(req.body);
			if (error) return res.status(400).send(error.details[0].message);

			// const { valid, reason, validators } = await isEmailValid(req.body.email);

			// if (!valid) return res.status(400).send({
			// 	message: "Vui lòng kiểm tra lại email của bạn!!! Email không hợp lệ",
			// 	reason: validators[reason].reason
			// })

			//generate new password
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(req.body.password, salt);

			//create new user
			const newUser = new User({
				fullname: req.body.fullname,
				email: req.body.email,
				password: hashedPassword,
				gender: {
					value: req.body.gender.value,
					label: labelOfGender[req.body.gender.value],
				},
			});

			// save user and respond
			const user = await newUser.save();

			//send email verify
			const token = await new Token({
				userId: user._id,
				token: crypto.randomBytes(16).toString('hex'),
			}).save();

			const link = `${hostClient}/auth/verify/${user._id}/${token.token}`;
			const status = await sendEmailVerify(user.email, 'Verify account', link, user);
			//check status
			if (!status) {
				//delete user and token
				await user.deleteOne();
				await token.deleteOne();
				return res.status(400).send('Gửi email xác nhận thất bại. Vui lòng kiểm tra lại email!!!');
			}
			res.status(200).json(user);
		} catch (err) {
			if (err.code === 11000) return res.status(500).send('Email đã tồn tại!');
			else
				return next(
					createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`)
				);
		}
	}

	//VERIFY
	async verify(req, res, next) {
		try {
			const { userId, token } = req.params;
			const user = await User.findById(userId);
			if (!user) return res.status(400).send('User không tồn tại!!!');
			const tokenVerify = await Token.findOne({ userId: user._id, token: token });
			if (!tokenVerify) return res.status(400).send('Link xác nhận không hợp lệ!!!');
			user.isVerified = true;
			await user.save();
			await tokenVerify.deleteOne();
			res.status(200).send('Xác nhận thành công!!!');
		} catch (err) {
			return next(
				createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`)
			);
		}
	}

	//Login with google
	async loginGoogle(req, res, next) {
		try {
			const user = req.user;
			const dataToken = {
				userId: user._id,
			};
			const accessToken = await authMethod.generateToken(dataToken, accessTokenSecret, accessTokenLife);

			// let refreshToken = randToken.generate(256);
			const refreshToken = await authMethod.generateToken(dataToken, refreshTokenSecret, refreshTokenLife);

			//save refresh token to redis and set expire time
			// await redisClient.set(user._id, refreshToken);
			// await redisClient.expire(user._id, 7 * 24 * 60 * 60);
			const userSave = await User.findById(user._id);
			if (user.lockTime - Date.now() > 0) {
				return res
					.status(401)
					.json(`Tài khoản đã bị khóa. Vui lòng thử lại sau ${moment(user.lockTime).locale('vi').fromNow()}`);
			}
			userSave.refreshToken = refreshToken;
			await userSave.save();

			return res.redirect(
				`${hostClient}/auth/login/google?accessToken=` + accessToken + '&refreshToken=' + refreshToken
			);
		} catch (err) {
			return next(
				createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`)
			);
		}
	}

	//Login by Github
	async loginGithub(req, res, next) {
		try {
			const user = req.user;
			const dataToken = {
				userId: user._id,
			};
			const accessToken = await authMethod.generateToken(dataToken, accessTokenSecret, accessTokenLife);

			const refreshToken = await authMethod.generateToken(dataToken, refreshTokenSecret, refreshTokenLife);

			//save refresh token to redis and set expire time
			// await redisClient.set(user._id, refreshToken);
			// await redisClient.expire(user._id, 7 * 24 * 60 * 60);
			const userSave = await User.findById(user._id);

			if (user.lockTime - Date.now() > 0) {
				return res
					.status(401)
					.json(`Tài khoản đã bị khóa. Vui lòng thử lại sau ${moment(user.lockTime).locale('vi').fromNow()}`);
			}
			userSave.refreshToken = refreshToken;
			await userSave.save();

			return res.redirect(
				`${hostClient}/auth/login/github?accessToken=` + accessToken + '&refreshToken=' + refreshToken
			);
		} catch (err) {
			return next(
				createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`)
			);
		}
	}

	//LOGIN
	async login(req, res, next) {
		try {
			//validate
			const schema = Joi.object({
				email: Joi.string().min(6).max(255).required().email(),
				password: Joi.string().min(6).max(1024).required(),
			});
			const { error } = schema.validate(req.body);
			if (error) return res.status(400).send(error.details[0].message);

			const user = await populateUserByEmail(req.body.email);
			if (!user) {
				return res.status(401).json('Email không tồn tại.');
			}

			if (user.password == null) {
				return res
					.status(401)
					.json('Tài khoản chưa đặt mật khẩu. Vui lòng đăng nhập bằng Google, và đặt mật khẩu mới!!!');
			}
			//check account is being blocked (LockTime - current time > 0)
			if (user.lockTime - Date.now() > 0) {
				return res
					.status(401)
					.json(`Tài khoản đã bị khóa. Vui lòng thử lại sau ${moment(user.lockTime).locale('vi').fromNow()}`);
			}

			const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
			if (!isPasswordValid) {
				//increase login attempt
				user.loginAttempts++;
				if (user.loginAttempts == 3) {
					//lock account after 5 minutes
					user.lockTime = Date.now() + 5 * 60 * 1000;
					await user.save();
					return res.status(401).json('Tài khoản đã bị khóa. Vui lòng thử lại sau 5 phút!!!');
				} else if (user.loginAttempts > 3) {
					//lock account forever
					user.lockTime = Date.now() + 100 * 365 * 24 * 60 * 60 * 1000;
					await user.save();
					return res
						.status(401)
						.json('Tài khoản đã bị khóa vĩnh viễn, Vui lòng liên hệ admin để được hỗ trợ!!!');
				} else {
					await user.save();
					return res.status(401).json('Mật khẩu không chính xác.');
				}
			}
			//reset login attempt
			user.loginAttempts = 0;

			const dataToken = {
				userId: user._id,
				role: user.role.name,
			};

			const accessToken = await authMethod.generateToken(dataToken, accessTokenSecret, accessTokenLife);

			if (!accessToken) {
				return res.status(401).send('Đăng nhập không thành công, vui lòng thử lại.');
			}
			const refreshToken = await authMethod.generateToken(dataToken, refreshTokenSecret, refreshTokenLife);
			user.refreshToken = refreshToken;
			await user.save();

			//save refresh token to redis and set expire time
			// await redisClient.set(user._id, refreshToken);
			// await redisClient.expire(user._id, 7 * 24 * 60 * 60);

			return res.status(200).json({
				msg: 'Đăng nhập thành công.',
				accessToken,
				refreshToken,
				user,
			});
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`)
			);
		}
	}

	// refresh token
	async refreshToken(req, res, next) {
		try {
			//validate token
			const schema = Joi.object({
				refreshToken: Joi.string().required(),
			});
			const { error } = schema.validate(req.body);
			if (error) return res.status(400).send(error.details[0].message);

			// get access token from header
			// const accessTokenFromHeader = req.headers.authorization;
			// if (!accessTokenFromHeader) {
			// 	return res.status(400).send('Không tìm thấy access token.');
			// }

			// get refresh token from body
			const refreshTokenFromBody = req.body.refreshToken;
			if (!refreshTokenFromBody) {
				return res.status(400).send('Không tìm thấy refresh token.');
			}

			// const accessToken_ = accessTokenFromHeader?.replace('Bearer ', '');
			// Decode access token đó
			const decoded = await authMethod.decodeToken(refreshTokenFromBody, refreshTokenSecret);
			if (!decoded) {
				return res.status(400).send('Refresh token không hợp lệ.');
			}
			const userId = decoded.payload.userId;
			// Check refreshToken with redis
			// const refreshToken = await redisClient.get(userId);
			// //check refresh token expired or not
			// if (!refreshToken || refreshToken !== refreshTokenFromBody) {
			// 	console.log(refreshToken, "không hợp lệ");
			// 	return res.status(401).send('Refresh token không hợp lệ hoặc đã hết hạn.');
			// }

			// Check refreshToken with database
			const user = await User.findById(mongoose.Types.ObjectId(userId));
			if (!user) {
				return res.status(400).send('Không tìm thấy người dùng.');
			}

			if (user.lockTime - Date.now() > 0) {
				return res
					.status(401)
					.json(`Tài khoản đã bị khóa. Vui lòng thử lại sau ${moment(user.lockTime).locale('vi').fromNow()}`);
			}

			if (user.refreshToken !== refreshTokenFromBody) {
				return res.status(401).send('Refresh token không hợp lệ hoặc đã hết hạn.');
			}

			// Generate new access token
			const dataToken = {
				userId,
				role: user.role.name,
			};
			const accessToken = await authMethod.generateToken(dataToken, accessTokenSecret, accessTokenLife);
			if (!accessToken) {
				return res.status(400).send('Tạo access token không thành công, vui lòng thử lại.');
			}

			return res.json({
				accessToken,
			});
		} catch (err) {
			console.log(err.message);
			return next(
				createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`)
			);
		}
	}

	// get link forgot password
	async sendLinkForgottenPassword(req, res, next) {
		try {
			const schema = Joi.object({
				email: Joi.string().email().required(),
			});
			const { error } = schema.validate(req.body);
			if (error) return res.status(400).send(error.details[0].message);

			const user = await User.findOne({ email: req.body.email });
			if (!user) return res.status(400).send('Email không tồn tại!!!');

			let token = await Token.findOne({ userId: user._id });
			if (!token) {
				token = await new Token({
					userId: user._id,
					token: crypto.randomBytes(32).toString('hex'),
				}).save();
			}

			const link = `${process.env.BASE_URL}/${user._id}/${token.token}`;
			const status = await sendEmail(user.email, 'Password reset', link, user);
			//check status
			if (!status) return res.status(400).send('Gửi email không thành công!!!');
			res.send('Link reset mật khẩu đã được gửi qua email của bạn');
		} catch (error) {
			console.log(error);
			return next(
				createError.InternalServerError(`${error.message} in method: ${req.method} of ${req.originalUrl}`)
			);
		}
	}

	async resetPassword(req, res, next) {
		try {
			const schema = Joi.object({ password: Joi.string().required() });
			const { error } = schema.validate(req.body);
			if (error) return res.status(400).send(error.details[0].message);

			const user = await User.findById(req.params.userId);
			if (!user) return res.status(400).send('Không tìm thấy người dùng!!!');

			const token = await Token.findOne({
				userId: user._id,
				token: req.params.token,
			});
			if (!token) return res.status(400).send('Link không đúng hoặc đã hết hạn');

			//hash password
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(req.body.password, salt);
			await user.save();
			await token.delete();

			res.send('Reset mật khẩu thành công!!.');
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`)
			);
		}
	}

	async logout(req, res) {
		try {
			const userId = req.user._id;
			await redisClient.del(userId);
			res.send('Đăng xuất thành công!!!');
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(`${err.message} in method: ${req.method} of ${req.originalUrl}`)
			);
		}
	}
}

module.exports = new AuthoController();
