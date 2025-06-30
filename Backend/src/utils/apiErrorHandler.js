class apiErrorHandler extends Error{
    constructor(
        statusCode,
        messsage='Internal Server Error',
        errors=[],
        stack="",

    ){
        super(messsage);
        this.statusCode = statusCode;
        this.errors = errors;
        this.stack = stack;
        this.data=null;
        this.sucsess = false;

        if (stack) {
        this.stack = stack;             
        
    }
    else{
        Error.captureStackTrace(this, this.constructor);
        this.stack = this.stack || new Error().stack;
    }
    }
}

export default apiErrorHandler;