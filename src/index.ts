// import express, { Request, Response, NextFunction } from "express";
import type { Request, Response, NextFunction } from "express";
import Tokens from 'csrf';

// Generates a CSRF Token and storees it in express-session
export const generateCSRFToken = (request: Request): string => {
  const tokens = new Tokens()
  const secret = tokens.secretSync();
  const token = tokens.create(secret);
  request.session.csrf_token = token;
  request.session.csrf_secret = secret;
  return token;
}

// Validates a CSRF Token from the POST request with the information stored in express-session
export const validateCSRFToken = (request: Request): boolean =>{
  const tokens = new Tokens()
  const isVerified = tokens.verify(request?.session?.csrf_secret ?? "", request?.body?.csrf_token);
  
  // Creating a new token so that the previous one is no longer valid.
  const new_secret = tokens.secretSync();
  const new_token = tokens.create(new_secret);
  // Saving tokens to session
  request.session.csrf_token = new_token;
  request.session.csrf_secret = new_secret;

  if (!isVerified) {
    return false;
  }
  return true;
}

export type CSRFErrorCallback = (
  err: Error,
  req: Request,
  res: Response
) => void;

// Middleware for validating automatically the CSRF Token.
export const validateCSRFMiddleware = (onErrorCallback?: CSRFErrorCallback) => {
  return (req:Request , res: Response, next: NextFunction) => {
    try {
      const isValid = validateCSRFToken(req);
      if (isValid) {
        next();
      } else {
        throw new Error('CSRF Token is invalid');
      }
    } catch (err) {
      if (typeof onErrorCallback === "function") {
        return onErrorCallback(err as Error, req, res);
      }
      return res.sendStatus(401);
    }
  }
}
