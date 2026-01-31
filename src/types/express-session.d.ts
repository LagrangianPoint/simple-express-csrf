// e.g. src/types/express-session.d.ts
import 'express-session';

declare module 'express-session' {
  interface SessionData {
    csrf_token?: string;
    csrf_secret?: string;
  }
}