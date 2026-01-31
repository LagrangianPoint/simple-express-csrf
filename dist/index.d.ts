import type { Request, Response, NextFunction } from "express";
export declare const generate_csrf_token: (request: Request) => string;
export declare const validate_csrf_token: (request: Request) => boolean;
export declare const validateCSRFMiddleware: (onErrorCallback: Function) => (req: Request, res: Response, next: NextFunction) => any;
//# sourceMappingURL=index.d.ts.map