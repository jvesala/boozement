// eslint-disable-next-line @typescript-eslint/no-unused-vars
import session from 'express-session';

declare module 'express-session' {
  export interface SessionData {
    passport?: any;
  }
}
