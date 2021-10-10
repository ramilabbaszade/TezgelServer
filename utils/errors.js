class GeneralError extends Error {
    constructor(message) {
        super();
        this.message = message;
    }

    getCode() {
        if (this instanceof BadRequest) {
            return 400;
        } else if (this instanceof NotFound) {
            return 404;
        } else if (this instanceof NotAuthorized) {
            return 401;
        } else if (this instanceof JWTExpired) {
            return 440;
        }
        return 500;
    }
}

class BadRequest extends GeneralError { }
class NotFound extends GeneralError { }
class NotAuthorized extends GeneralError {}
class JWTExpired extends GeneralError {}

export {
    GeneralError,
    BadRequest,
    NotAuthorized,
    NotFound,
    JWTExpired
};