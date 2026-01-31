import type { Request, Response, NextFunction } from "express";
export declare const generateCSRFToken: (request: Request) => string;
export declare const validateCSRFToken: (request: Request) => boolean;
export type CSRFErrorCallback = (err: Error, req: Request, res: Response) => void;
export declare const validateCSRFMiddleware: (onErrorCallback?: CSRFErrorCallback) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=index.d.ts.map