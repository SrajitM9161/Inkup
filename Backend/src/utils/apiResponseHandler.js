class ApiResponseHandler {
  constructor(statusCode, message = 'Success', data = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }

  send(res) {
    return res.status(this.statusCode).json({
      success: this.success,
      message: this.message,
      data: this.data,
    });
  }
}

export default ApiResponseHandler;
