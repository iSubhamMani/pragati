export class UnauthorizedError extends Error {
    constructor(message = "Unauthorized") {
        super(message);
        this.name = "UnauthorizedError";
    }
}

export class NotFoundError extends Error {
    constructor(message = "Resource not found") {
        super(message);
        this.name = "NotFoundError";
    }
}

export class BadRequestError extends Error {
    constructor(message = "Bad request") {
        super(message);
        this.name = "BadRequestError";
    }
}