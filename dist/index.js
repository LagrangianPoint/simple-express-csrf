import session from 'express-session';
import Tokens from 'csrf';
// Generates a CSRF Token and storees it in express-session
export const generate_csrf_token = (request) => {
    const tokens = new Tokens();
    const secret = tokens.secretSync();
    const token = tokens.create(secret);
    request.session.csrf_token = token;
    request.session.csrf_secret = secret;
    return token;
};
// Validates a CSRF Token from the POST request with the information stored in express-session
export const validate_csrf_token = (request) => {
    const tokens = new Tokens();
    const isVerified = tokens.verify(request?.session?.csrf_secret ?? "", request?.body?.csrf_token);
    // Creating a new token so that the previous one is no longer valid.
    const secret = tokens.secretSync();
    tokens.create(secret);
    if (!isVerified) {
        return false;
    }
    return true;
};
// Middleware for validating automatically the CSRF Token.
export const validateCSRFMiddleware = (onErrorCallback) => {
    return (req, res, next) => {
        try {
            const isValid = validate_csrf_token(req);
            if (isValid) {
                next();
            }
            else {
                throw new Error('CSRF Token is invalid');
            }
        }
        catch (err) {
            if (typeof onErrorCallback === "function") {
                return onErrorCallback(err, req, res);
            }
            return res.sendStatus(401);
        }
    };
};
//# sourceMappingURL=index.js.map