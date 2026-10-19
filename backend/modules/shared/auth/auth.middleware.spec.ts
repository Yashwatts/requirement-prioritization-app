import { UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthMiddleware } from './auth.middleware';
import { FirebaseAuthService } from './firebase-auth.service';

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware;
  let mockFirebaseAuthService: Partial<FirebaseAuthService>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockFirebaseAuthService = {
      verifyIdToken: jest.fn(),
    };
    middleware = new AuthMiddleware(
      mockFirebaseAuthService as FirebaseAuthService,
    );
    mockResponse = {};
    mockNext = jest.fn();
  });

  const createMockRequest = (authHeader?: string): Partial<Request> => ({
    headers: {
      authorization: authHeader,
    },
    user: undefined,
  });

  it('should throw 401 UnauthorizedException when Authorization header is missing', async () => {
    const req = createMockRequest(undefined);

    await expect(
      middleware.use(req as Request, mockResponse as Response, mockNext),
    ).rejects.toThrow(UnauthorizedException);
    await expect(
      middleware.use(req as Request, mockResponse as Response, mockNext),
    ).rejects.toThrow('Authorization header is missing.');
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should throw 401 UnauthorizedException when Authorization header format is invalid (not Bearer scheme)', async () => {
    const req = createMockRequest('Basic dXNlcjpwYXNz');

    await expect(
      middleware.use(req as Request, mockResponse as Response, mockNext),
    ).rejects.toThrow(UnauthorizedException);
    await expect(
      middleware.use(req as Request, mockResponse as Response, mockNext),
    ).rejects.toThrow(
      'Invalid authorization header format. Expected "Bearer <token>".',
    );
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should throw 401 UnauthorizedException when Bearer header has no token', async () => {
    const req = createMockRequest('Bearer ');

    await expect(
      middleware.use(req as Request, mockResponse as Response, mockNext),
    ).rejects.toThrow(UnauthorizedException);
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should throw 401 UnauthorizedException when Firebase token is invalid', async () => {
    (mockFirebaseAuthService.verifyIdToken as jest.Mock).mockRejectedValueOnce(
      new Error('Invalid token signature'),
    );

    const req = createMockRequest('Bearer invalid-token');

    await expect(
      middleware.use(req as Request, mockResponse as Response, mockNext),
    ).rejects.toThrow(UnauthorizedException);
    await expect(
      middleware.use(req as Request, mockResponse as Response, mockNext),
    ).rejects.toThrow('Invalid or expired authentication token.');
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should throw 401 UnauthorizedException when Firebase token is expired', async () => {
    (mockFirebaseAuthService.verifyIdToken as jest.Mock).mockRejectedValueOnce(
      new Error('Firebase ID token has expired.'),
    );

    const req = createMockRequest('Bearer expired-token');

    await expect(
      middleware.use(req as Request, mockResponse as Response, mockNext),
    ).rejects.toThrow(UnauthorizedException);
    await expect(
      middleware.use(req as Request, mockResponse as Response, mockNext),
    ).rejects.toThrow('Invalid or expired authentication token.');
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should call next() and populate req.user when Firebase token is valid', async () => {
    const mockDecodedToken = {
      uid: 'firebase-user-999',
      email: 'user@example.com',
      name: 'Authenticated User',
      aud: 'zenmonk-main',
      auth_time: 12345,
      exp: 67890,
      firebase: { identities: {}, sign_in_provider: 'google.com' },
      iat: 12345,
      iss: 'https://securetoken.google.com/zenmonk-main',
      sub: 'firebase-user-999',
    };

    (mockFirebaseAuthService.verifyIdToken as jest.Mock).mockResolvedValueOnce(
      mockDecodedToken,
    );

    const req = createMockRequest('Bearer valid-firebase-token');

    await middleware.use(req as Request, mockResponse as Response, mockNext);

    expect(mockFirebaseAuthService.verifyIdToken).toHaveBeenCalledWith(
      'valid-firebase-token',
    );
    expect(req.user).toEqual({
      uid: 'firebase-user-999',
      email: 'user@example.com',
      name: 'Authenticated User',
    });
    expect(mockNext).toHaveBeenCalledTimes(1);
  });
});
