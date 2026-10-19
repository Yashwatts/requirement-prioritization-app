import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { FirebaseAuthService } from './firebase-auth.service';
import { AuthenticatedUser } from './user-context.interface';

declare module 'express' {
  interface Request {
    user?: AuthenticatedUser;
  }
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly firebaseAuthService: FirebaseAuthService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing.');
    }

    const parts = authHeader.trim().split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) {
      throw new UnauthorizedException(
        'Invalid authorization header format. Expected "Bearer <token>".',
      );
    }

    const token = parts[1];

    try {
      const decoded = await this.firebaseAuthService.verifyIdToken(token);

      req.user = {
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name,
      };

      next();
    } catch {
      throw new UnauthorizedException(
        'Invalid or expired authentication token.',
      );
    }
  }
}
