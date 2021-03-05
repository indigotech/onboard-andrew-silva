import { Request, Response } from 'express';
import { BaseError } from '@api/error/base-error';
import { AuthChecker } from 'type-graphql';
import jwt from 'jsonwebtoken';

export interface Payload {
  id: string;
  name: string;
  email: string;
}

export interface ServerContext {
  userId: string | undefined;
}

interface ServerRequest {
  req: Request;
  res: Response;
}

export class Authenticator {
  static getJWT = (payload: Payload, extendedExpiration: boolean = false): string => {
    return jwt.sign(payload, String(process.env.JWT_SECRET), {
      expiresIn: extendedExpiration
        ? Number(process.env.JWT_EXTENDED_EXPIRATION_TIME)
        : Number(process.env.JWT_EXPIRATION_TIME),
    });
  };

  static getPayload = (token: string): Payload | undefined => {
    try {
      return Object(jwt.verify(token, String(process.env.JWT_SECRET)));
    } catch (err) {
      return undefined;
    }
  };

  static context = ({ req, res }: ServerRequest) => {
    const bearerToken = req.headers?.authorization;

    if (!bearerToken) {
      return null;
    }

    const token = bearerToken.replace('Bearer ', '');
    const payload = Authenticator.getPayload(token);

    if (payload) {
      const context: ServerContext = {
        userId: payload?.id,
      };

      return context;
    }
  };
}
