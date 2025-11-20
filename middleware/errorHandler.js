const { errorResponse } = require('../helpers/responseHelper');

module.exports = (err, req, res, next) => {
	console.error(err.stack);

	const statusCode = err.statusCode || 500;

	return res.status(statusCode).json(
		errorResponse(err.message || 'Internal Server Error', statusCode)
	);
};
