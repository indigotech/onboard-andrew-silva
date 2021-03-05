import jwt from 'jsonwebtoken';

export class Payload {
  id!: string;
  name!: string;
  email!: string;
}

export class Authenticator {
  static getJWT = (payload: Payload, extendedExpiration: boolean = false): string => {
    return jwt.sign(payload, String(process.env.JWT_SECRET), {
      expiresIn: extendedExpiration
        ? Number(process.env.JWT_EXTENDED_EXPIRATION_TIME)
        : Number(process.env.JWT_EXPIRATION_TIME),
    });
  };

  static getPayload = (token: string): Payload => {
    return Object(jwt.verify(token, String(process.env.JWT_SECRET)));
  };

  static authenticate = (req: any) => {
    console.log(req);
  };
}
