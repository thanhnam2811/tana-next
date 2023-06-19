const crypto = require('crypto');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const createError = require('http-errors');
const moment = require('moment');
const { default: mongoose } = require('mongoose');
const authMethod = require('../../auth/auth.method');
const redisClient = require('../../configs/redis/index');
// const randToken = require('rand-Token');
const { populateUserByEmail } = require('../../utils/Populate/User');
const { sendEmail, sendEmailVerify } = require('../../utils/Mail/sendMail');
const Token = require('../models/Token');
const { User, labelOfGender } = require('../models/User');
const { responseError } = require('../../utils/Response/error');

const hostClient = process.env.HOST_CLIENT;
const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
class AuthoController {
	// REGISTER
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
			}).unknown();
			const { error } = schema.validate(req.body);
			if (error) {
				return responseError(res, 400, error.details[0].message);
			}

			// const { valid, reason, validators } = await isEmailValid(req.body.email);

			// if (!valid) return res.status(400).send({
			// 	message: "Vui lòng kiểm tra lại email của bạn!!! Email không hợp lệ",
			// 	reason: validators[reason].reason
			// })

			// generate new password
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(req.body.password, salt);

			// create new user
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

			// send email verify
			const token = await new Token({
				userId: user._id,
				token: crypto.randomBytes(16).toString('hex'),
			}).save();

			const link = `${hostClient}/auth/verify/${user._id}/${token.token}`;
			const status = await sendEmailVerify(user.email, 'Verify account', link, user);
			// check status
			if (!status) {
				// delete user and token
				await user.deleteOne();
				await token.deleteOne();
				return responseError(res, 400, 'Gửi email xác nhận thất bại. Vui lòng kiểm tra lại email!!!');
			}
			res.status(200).json(user);
		} catch (err) {
			if (err.code === 11000) {
				return responseError(res, 400, 'Email đã tồn tại!');
			}
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// VERIFY
	async verify(req, res, next) {
		try {
			const { userId, token } = req.params;
			const user = await User.findById(userId);
			if (!user) {
				return responseError(res, 400, 'User không tồn tại!!!');
			}
			const tokenVerify = await Token.findOne({ userId: user._id, token });
			if (!tokenVerify) {
				return responseError(res, 400, 'Link xác nhận không hợp lệ!!!');
			}
			user.isVerified = true;
			await user.save();
			await tokenVerify.deleteOne();
			res.status(200).json('Xác nhận thành công!!!');
		} catch (err) {
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// Login with google
	async loginGoogle(req, res, next) {
		try {
			const { user } = req;
			const dataToken = {
				userId: user._id,
			};
			const accessToken = await authMethod.generateToken(dataToken, accessTokenSecret, accessTokenLife);

			// let refreshToken = randToken.generate(256);
			const refreshToken = await authMethod.generateToken(dataToken, refreshTokenSecret, refreshTokenLife);

			// save refresh token to redis and set expire time
			// await redisClient.set(user._id, refreshToken);
			// await redisClient.expire(user._id, 7 * 24 * 60 * 60);
			const userSave = await User.findById(user._id);
			if (user.lockTime - Date.now() > 0) {
				return responseError(
					res,
					401,
					`Tài khoản đã bị khóa. Vui lòng thử lại sau ${moment(user.lockTime).locale('vi').fromNow()}`
				);
			}
			userSave.refreshToken = refreshToken;
			userSave.isVerified = true;
			await userSave.save();

			return res.redirect(
				`${hostClient}/auth/login/google?accessToken=${accessToken}&refreshToken=${refreshToken}`
			);
		} catch (err) {
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// Login by Github
	async loginGithub(req, res, next) {
		try {
			const { user } = req;
			const dataToken = {
				userId: user._id,
			};
			const accessToken = await authMethod.generateToken(dataToken, accessTokenSecret, accessTokenLife);

			const refreshToken = await authMethod.generateToken(dataToken, refreshTokenSecret, refreshTokenLife);

			// save refresh token to redis and set expire time
			// await redisClient.set(user._id, refreshToken);
			// await redisClient.expire(user._id, 7 * 24 * 60 * 60);
			const userSave = await User.findById(user._id);

			if (user.lockTime - Date.now() > 0) {
				return responseError(
					res,
					401,
					`Tài khoản đã bị khóa. Vui lòng thử lại sau ${moment(user.lockTime).locale('vi').fromNow()}`
				);
			}
			userSave.refreshToken = refreshToken;
			userSave.isVerified = true;
			await userSave.save();

			return res.redirect(
				`${hostClient}/auth/login/github?accessToken=${accessToken}&refreshToken=${refreshToken}`
			);
		} catch (err) {
			return next(
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// LOGIN
	async login(req, res, next) {
		try {
			// validate
			const schema = Joi.object({
				email: Joi.string().min(6).max(255).required().email(),
				password: Joi.string().min(6).max(1024).required(),
			}).unknown();
			const { error } = schema.validate(req.body);
			if (error) {
				return responseError(res, 400, error.details[0].message);
			}

			const user = await populateUserByEmail(req.body.email);
			if (!user) {
				return responseError(res, 401, 'Email không tồn tại.');
			}

			if (user.password == null) {
				return responseError(
					res,
					401,
					'Tài khoản chưa đặt mật khẩu. Vui lòng đăng nhập bằng Google, và đặt mật khẩu mới!!!'
				);
			}

			//check isVerify
			// if (!user.isVerified) {
			// 	const exsitToken = await Token.findOne({
			// 		userId: user._id,
			// 	});

			// 	if (exsitToken) {
			// 		await exsitToken.deleteOne();
			// 	}

			// 	// send email verify
			// 	const token = await new Token({
			// 		userId: user._id,
			// 		token: crypto.randomBytes(16).toString('hex'),
			// 	}).save();

			// 	const link = `${hostClient}/auth/verify/${user._id}/${token.token}`;
			// 	const status = await sendEmailVerify(user.email, 'Verify account', link, user);
			// 	if (!status) return res.status(500).json('Gửi email xác nhận thất bại. Vui lòng thử lại!!!');

			// 	return responseError(res, 401, 'Tài khoản chưa được xác nhận. Vui lòng kiểm tra email!!!');
			// }
			// check account is being blocked (LockTime - current time > 0)
			if (user.lockTime - Date.now() > 0) {
				return responseError(
					res,
					401,
					`Tài khoản đã bị khóa. Vui lòng thử lại sau ${moment(user.lockTime).locale('vi').fromNow()}`
				);
			}

			const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
			if (!isPasswordValid) {
				// increase login attempt
				user.loginAttempts++;
				if (user.loginAttempts == 3) {
					// lock account after 5 minutes
					user.lockTime = Date.now() + 5 * 60 * 1000;
					await user.save();
					return responseError(res, 401, 'Tài khoản đã bị khóa. Vui lòng thử lại sau 5 phút!!!');
				}
				if (user.loginAttempts > 3) {
					// lock account forever
					user.lockTime = Date.now() + 100 * 365 * 24 * 60 * 60 * 1000;
					await user.save();
					return responseError(
						res,
						401,
						'Tài khoản đã bị khóa vĩnh viễn, Vui lòng liên hệ admin để được hỗ trợ!!!'
					);
				}
				await user.save();
				return responseError(res, 401, 'Mật khẩu không chính xác.');
			}
			// reset login attempt
			user.loginAttempts = 0;

			const dataToken = {
				userId: user._id,
				role: user.role.name,
			};

			const accessToken = await authMethod.generateToken(dataToken, accessTokenSecret, accessTokenLife);

			if (!accessToken) {
				return responseError(res, 401, 'Đăng nhập không thành công, vui lòng thử lại.');
			}
			const refreshToken = await authMethod.generateToken(dataToken, refreshTokenSecret, refreshTokenLife);
			user.refreshToken = refreshToken;
			await user.save();

			// save refresh token to redis and set expire time
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
				createError.InternalServerError(
					`${err.message}\nin method: ${req.method} of ${req.originalUrl}\nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)}`
				)
			);
		}
	}

	// refresh token
	async refreshToken(req, res, next) {
		try {
			// validate token
			const schema = Joi.object({
				refreshToken: Joi.string().required(),
			}).unknown();
			const { error } = schema.validate(req.body);
			if (error) {
				return responseError(res, 400, error.details[0].message);
			}

			// get access token from header
			// const accessTokenFromHeader = req.headers.authorization;
			// if (!accessTokenFromHeader) {
			// 	return res.status(400).send('Không tìm thấy access token.');
			// }

			// get refresh token from body
			const refreshTokenFromBody = req.body.refreshToken;
			if (!refreshTokenFromBody) {
				return responseError(res, 400, 'Không tìm thấy refresh token.');
			}

			// const accessToken_ = accessTokenFromHeader?.replace('Bearer ', '');
			// Decode access token đó
			const decoded = await authMethod.decodeToken(refreshTokenFromBody, refreshTokenSecret);
			if (!decoded) {
				return responseError(res, 400, 'Refresh token không hợp lệ.');
			}
			const { userId } = decoded.payload;
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
				return responseError(res, 400, 'Không tìm thấy người dùng.');
			}

			if (user.lockTime - Date.now() > 0) {
				return responseError(
					res,
					401,
					`Tài khoản đã bị khóa.Vui lòng thử lại sau ${moment(user.lockTime).locale('vi').fromNow()} `
				);
			}

			if (user.refreshToken !== refreshTokenFromBody) {
				return responseError(res, 401, 'Refresh token không hợp lệ hoặc đã hết hạn');
			}

			// Generate new access token
			const dataToken = {
				userId,
				role: user.role.name,
			};
			const accessToken = await authMethod.generateToken(dataToken, accessTokenSecret, accessTokenLife);
			if (!accessToken) {
				return responseError(res, 400, 'Tạo access token không thành công, vui lòng thử lại.');
			}

			return res.json({
				accessToken,
			});
		} catch (err) {
			console.log(err.message);
			return next(
				createError.InternalServerError(
					`${err.message} \nin method: ${req.method} of ${req.originalUrl} \nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)} `
				)
			);
		}
	}

	// get link forgot password
	async sendLinkForgottenPassword(req, res, next) {
		try {
			const schema = Joi.object({
				email: Joi.string().email().required(),
			}).unknown();
			const { error } = schema.validate(req.body);
			if (error) {
				return responseError(res, 400, error.details[0].message);
			}

			const user = await User.findOne({ email: req.body.email });
			if (!user) {
				return responseError(res, 400, 'Email không tồn tại!!!');
			}

			let token = await Token.findOne({ userId: user._id });
			if (!token) {
				token = await new Token({
					userId: user._id,
					token: crypto.randomBytes(32).toString('hex'),
				}).save();
			}

			const link = `${process.env.BASE_URL} /${user._id}/${token.token} `;
			const status = await sendEmail(user.email, 'Password reset', link, user);
			// check status
			if (!status) {
				return responseError(res, 400, 'Gửi email thất bại!!!');
			}
			res.send('Link reset mật khẩu đã được gửi qua email của bạn');
		} catch (error) {
			console.log(error);
			return next(
				createError.InternalServerError(`${error.message} in method: ${req.method} of ${req.originalUrl} `)
			);
		}
	}

	async resetPassword(req, res, next) {
		try {
			const schema = Joi.object({ password: Joi.string().required() }).unknown();
			const { error } = schema.validate(req.body);
			if (error) {
				return responseError(res, 400, error.details[0].message);
			}

			const user = await User.findById(req.params.userId);
			if (!user) {
				return responseError(res, 400, 'Không tìm thấy người dùng');
			}

			const token = await Token.findOne({
				userId: user._id,
				token: req.params.token,
			});
			if (!token) {
				return responseError(res, 400, 'Link không đúng hoặc đã hết hạn');
			}

			// hash password
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(req.body.password, salt);
			await user.save();
			await token.delete();

			res.send('Reset mật khẩu thành công!!.');
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message} \nin method: ${req.method} of ${req.originalUrl} \nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)} `
				)
			);
		}
	}

	// change password
	async changePassword(req, res, next) {
		try {
			const schema = Joi.object({
				oldPassword: Joi.string().required(),
				newPassword: Joi.string().required(),
				confirmPassword: Joi.string().required(),
			}).unknown();
			const { error } = schema.validate(req.body);
			if (error) {
				return responseError(res, 400, error.details[0].message);
			}

			const user = await User.findById(req.user._id);
			if (!user) {
				return responseError(res, 400, 'Không tìm thấy người dùng');
			}

			const isPasswordValid = bcrypt.compareSync(req.body.oldPassword, user.password);
			if (!isPasswordValid) {
				return responseError(res, 400, 'Mật khẩu cũ không đúng');
			}

			// check newPassword and confirmPassword
			if (req.body.newPassword !== req.body.confirmPassword) {
				return responseError(res, 400, 'Mật khẩu mới và xác nhận mật khẩu không khớp');
			}

			// generate new password
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
			user.password = hashedPassword;
			await user.save();
			return res.status(200).json('Thay đổi mật khẩu thành công!!');
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message} \nin method: ${req.method} of ${req.originalUrl} \nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)} `
				)
			);
		}
	}

	// set password
	async setPassword(req, res, next) {
		try {
			const schema = Joi.object({
				newPassword: Joi.string().required(),
				confirmPassword: Joi.string().required(),
			}).unknown();
			const { error } = schema.validate(req.body);
			if (error) {
				return responseError(res, 400, error.details[0].message);
			}

			const user = await User.findById(req.user._id);
			if (!user) {
				return responseError(res, 400, 'Không tìm thấy người dùng');
			}

			// check newPassword and confirmPassword
			if (req.body.newPassword !== req.body.confirmPassword) {
				return responseError(res, 400, 'Mật khẩu mới và xác nhận mật khẩu không khớp');
			}

			// generate new password
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

			// save hashedPassword to redis set time expire 5m
			await redisClient.set(`password:${user._id}`, hashedPassword, 'EX', 60 * 5);

			// send email verify
			const token = await new Token({
				userId: user._id,
				token: crypto.randomBytes(16).toString('hex'),
			}).save();

			const link = `${hostClient}/auth/comfirm-set-password/${user._id}/${token.token}`;
			const status = await sendEmailVerify(user.email, 'Comfirm set password', link, user);
			// check status
			if (!status) {
				// delete user and token
				await user.deleteOne();
				await token.deleteOne();
				return responseError(res, 400, 'Gửi email xác nhận thất bại. Vui lòng kiểm tra lại email!!!');
			}

			return res.status(200).json('Vuii lòng xác nhận đặt mật khẩu qua mail.');
		} catch (error) {
			console.log(error.message);
			return next(
				createError.InternalServerError(
					`${error.message} \nin method: ${req.method} of ${req.originalUrl} \nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)} `
				)
			);
		}
	}

	// confirm set password
	async confirmSetPassword(req, res, next) {
		try {
			const { userId, token } = req.params;
			const user = await User.findById(userId);
			if (!user) {
				return responseError(res, 400, 'User không tồn tại!!!');
			}
			const tokenVerify = await Token.findOne({ userId: user._id, token });
			if (!tokenVerify) {
				return responseError(res, 400, 'Link xác nhận không hợp lệ!!!');
			}

			// get hashedPassword from redis
			const hashedPassword = await redisClient.get(`password:${user._id}`);
			if (!hashedPassword) {
				return responseError(res, 400, 'Link xác nhận đã hết hạn!!!');
			}

			// update password
			user.password = hashedPassword;
			await user.save();
			redisClient.del(`${user._id}:tokens`); // delete all tokens for this account
			await tokenVerify.deleteOne();
			return res.status(200).json('Đặt mật khẩu thành công!!!');
		} catch (error) {
			console.log(error.message);
			return next(
				createError.InternalServerError(
					`${error.message} \nin method: ${req.method} of ${req.originalUrl} \nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)} `
				)
			);
		}
	}

	async logout(req, res, next) {
		try {
			const userId = req.user._id;
			await redisClient.del(userId);
			res.send('Đăng xuất thành công!!!');
		} catch (err) {
			console.log(err);
			return next(
				createError.InternalServerError(
					`${err.message} \nin method: ${req.method} of ${req.originalUrl} \nwith body: ${JSON.stringify(
						req.body,
						null,
						2
					)} `
				)
			);
		}
	}
}

module.exports = new AuthoController();
