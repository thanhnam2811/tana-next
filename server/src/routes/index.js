const Message = require('./messages');
const Conversation = require('./conversations');
const Auth = require('./auth');
const User = require('./users');
const File = require('./files');
const Post = require('./posts');
const Role = require('./roles');
const Comment = require('./comments');
const Report = require('./reports');
const Admin = require('./admin');
const createError = require('http-errors');
const logEvents = require('../Helpers/logEvents');
const { v4: uuidv4 } = require('uuid');
const limiter = require('../app/middlewares/Limiter');
function route(app) {
	//limit access to 20 requests per 1 minutes
	app.use(limiter);
	// route
	app.use('/admin', Admin);
	app.use('/files', File);
	app.use('/conversations/:conversationId/messages', Message);
	app.use('/conversations', Conversation);
	app.use('/posts/:postId/comments', Comment);
	app.use('/posts', Post);
	app.use('/users', User);
	app.use('/roles', Role);
	app.use('/auth', Auth);
	app.use('/reports', Report);
	//get error 404
	app.use((req, res, next) => {
		next(createError(404, `Method: ${req.method} of ${req.originalUrl}  not found`));
	});
	//get all errors
	app.use((error, req, res, next) => {
		logEvents(`idError: ${uuidv4()} - ${error.message}`);
		res.status(error.status || 500);
		res.json({
			error: {
				message: error.message,
			},
		});
	});
}

module.exports = route;
