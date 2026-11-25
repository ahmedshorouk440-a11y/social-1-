"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthrizedExption = exports.ConflictExcption = exports.NotFoundExcption = exports.BadRequestExcption = exports.ApplicationExcption = void 0;
class ApplicationExcption extends Error {
    status;
    constructor(message, status, cause) {
        super(message, { cause });
        this.status = status;
        this.name = this.constructor.name;
    }
}
exports.ApplicationExcption = ApplicationExcption;
class BadRequestExcption extends ApplicationExcption {
    constructor(message = "Bad Request", cause) {
        super(message, 400, cause);
    }
}
exports.BadRequestExcption = BadRequestExcption;
class NotFoundExcption extends ApplicationExcption {
    constructor(message = "Not Found", cause) {
        super(message, 404, cause);
    }
}
exports.NotFoundExcption = NotFoundExcption;
class ConflictExcption extends ApplicationExcption {
    constructor(message = "Conflict", cause) {
        super(message, 409, cause);
    }
}
exports.ConflictExcption = ConflictExcption;
class UnauthrizedExption extends ApplicationExcption {
    constructor(message = "UnAuthrized", cause) {
        super(message, 401, cause);
    }
}
exports.UnauthrizedExption = UnauthrizedExption;
