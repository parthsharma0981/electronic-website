import { jest } from '@jest/globals';
import httpMocks from 'node-mocks-http';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect, admin } from '../middleware/authMiddleware.js';

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'testsecret';
  });

  describe('protect middleware', () => {
    it('should throw 401 if no authorization header is present', async () => {
      // Because `protect` is an asyncHandler, it wraps the internal async func.
      // We pass req, res, next. It catches errors and passes them to next().
      
      await protect(req, res, next);
      
      expect(res.statusCode).toBe(401);
      // Wait, asyncHandler catches throw new Error and passes them to next(err).
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe('Not authorized, no token');
    });

    it('should throw 401 if token is present but verification fails', async () => {
      req.headers.authorization = 'Bearer invalidtoken';
      jest.spyOn(jwt, 'verify').mockImplementation(() => { throw new Error('Invalid signature'); });

      await protect(req, res, next);

      expect(res.statusCode).toBe(401);
      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe('Not authorized, token failed');
      
      jwt.verify.mockRestore();
    });

    it('should call next() successfully when a valid token is provided', async () => {
      req.headers.authorization = 'Bearer validtoken';
      const verifySpy = jest.spyOn(jwt, 'verify').mockReturnValue({ id: 'user123' });

      // Mock User.findById().select() chaining
      const mockSelect = jest.fn().mockResolvedValue({ _id: 'user123', name: 'Test User' });
      const findByIdSpy = jest.spyOn(User, 'findById').mockReturnValue({ select: mockSelect });

      await protect(req, res, next);

      expect(verifySpy).toHaveBeenCalledWith('validtoken', 'testsecret');
      expect(findByIdSpy).toHaveBeenCalledWith('user123');
      expect(mockSelect).toHaveBeenCalledWith('-password');
      expect(req.user).toEqual({ _id: 'user123', name: 'Test User' });
      expect(next).toHaveBeenCalledWith(); // Called with no args (success)
      
      verifySpy.mockRestore();
      findByIdSpy.mockRestore();
    });
  });

  describe('admin middleware', () => {
    it('should throw 401 if user is not present or not an admin', () => {
      req.user = { role: 'user' };

      // admin is NOT wrapped in asyncHandler usually (synchronous)
      expect(() => admin(req, res, next)).toThrow('Not authorized as an admin');
      expect(res.statusCode).toBe(401);
    });

    it('should call next() if user is an admin', () => {
      req.user = { role: 'admin' };

      admin(req, res, next);

      expect(next).toHaveBeenCalledWith(); // Success
    });
  });
});
