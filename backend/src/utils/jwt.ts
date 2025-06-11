import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'restion_secret';
const JWT_EXPIRES_IN = '7d';

export function signToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET);
}; 