// Standardized API Response Formatter for CASEVAULT
// Format conforms strictly to Section 31 of Problem Specification

function successResponse(res, data = {}, message = "Operation completed successfully", statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    message
  });
}

function errorResponse(res, code = "INTERNAL_SERVER_ERROR", message = "An error occurred", statusCode = 500) {
  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message
    }
  });
}

module.exports = {
  successResponse,
  errorResponse
};
