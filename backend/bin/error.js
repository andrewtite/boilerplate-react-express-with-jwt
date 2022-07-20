export class ExtendableError extends Error {
    constructor(message) {
        if (new.target === ExtendableError)
            throw new TypeError('Abstract class "ExtendableError" cannot be instantiated directly.');
        super(message);
        this.message = message;
        this.stack = (new Error()).stack;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.contructor);
    }
}

// 400 Bad Request
export class BadRequest extends ExtendableError {
    constructor(m) {
        if (arguments.length === 0)
            super('bad request');
        else
            super(m);
    }
}

// 401 Unauthorized
export class Unauthorized extends ExtendableError {
    constructor(m) {
        if (arguments.length === 0)
            super('unauthorized');
        else
            super(m);
    }
}

// 403 Forbidden
export class Forbidden extends ExtendableError {
    constructor(m) {
        if (arguments.length === 0)
            super('forbidden');
        else
            super(m);
    }
}

// 404 Not Found
export class NotFound extends ExtendableError {
    constructor(m) {
        if (arguments.length === 0)
            super('not found');
        else
            super(m);
    }
}

// 409 Conflict
export class Conflict extends ExtendableError {
    constructor(m) {
        if (arguments.length === 0)
            super('conflict');
        else
            super(m);
    }
}

// 422 Unprocessable Entity
export class UnprocessableEntity extends ExtendableError {
    constructor(m) {
        if (arguments.length === 0)
            super('unprocessable entity');
        else
            super(m);
    }
}

// 500 Internal Server Error
export class InternalServerError extends ExtendableError {
    constructor(m) {
        if (arguments.length === 0)
            super('internal server error');
        else
            super(m);
    }
}
