/**
 * Success Response
 */
const successResponse = (message, data = {}, statusCode = 200) => {
	return {
		status: true,
		statusCode,
		message,
		data,
	};
};

/**
 * Error Response
 */
const errorResponse = (message, errors = null, statusCode = 400) => {
	return {
		status: false,
		statusCode,
		message,
		errors,
	};
};

module.exports = {
	successResponse,
	errorResponse,
};
