import type { NextFunction, Request, Response } from 'express';
import * as t from 'io-ts';
import { pipe } from 'fp-ts/lib/pipeable';
import { fold } from 'fp-ts/lib/Either';

export const validateBody =
  (type: t.Type<any>) => (req: Request, res: Response, next: NextFunction) => {
    const onLeft = (errors: t.Errors) => {
      console.log(
        `Request payload validation failed for: ${type} with ${errors.length} errors!`,
      );
      console.log(req.body);
      console.log(JSON.stringify(errors));
      res.sendStatus(409);
    };
    const onRight = (s: typeof type) => {
      req.body = s;
      next();
    };
    pipe(type.decode(req.body), fold(onLeft, onRight));
  };
