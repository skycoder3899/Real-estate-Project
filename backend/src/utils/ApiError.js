class ApiError extends Error{
    constructor(statusCode,data,message= "Something went wrong",errors= [],stack = ""){
        super(message);
        this.statusCode=statusCode;
         this.data=data;
         this.message=message;
         this.errors=errors;
         this.success=false;
         if(stack) this.stack=stack;
         else this.stack=Error.captureStackTrace(this,this.constructor);
    }
}

export {ApiError};