import { jest } from '@jest/globals';
import httpMocks from 'node-mocks-http';
import Product from '../models/Product.js';

// We have to mock the module BEFORE importing the controller that uses it
// Since we use the new ESM unstable_mockModule for deep module mocks
export const mockGenerateContent = jest.fn().mockResolvedValue({
  text: 'Hello from mock Gemini AI!'
});

jest.unstable_mockModule('@google/genai', () => {
  return {
    GoogleGenAI: jest.fn().mockImplementation(() => ({
      models: {
        generateContent: mockGenerateContent
      }
    }))
  };
});

// Import dynamically to ensure it runs *after* unstable_mockModule setup
const { generateChatResponse } = await import('../controllers/chatController.js');

describe('Chat Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = httpMocks.createRequest({ method: 'POST', body: {} });
    res = httpMocks.createResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should throw 400 if messages array is missing or invalid', async () => {
    // Missing messages entirely
    await generateChatResponse(req, res, next);
    expect(res.statusCode).toBe(400);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toBe('Messages array is required');

    // Reset and try invalid format
    res = httpMocks.createResponse();
    next = jest.fn();
    req.body.messages = "invalid-format"; 
    await generateChatResponse(req, res, next);
    expect(res.statusCode).toBe(400);
  });

  it('should throw 500 if GEMINI_API_KEY is not set', async () => {
    delete process.env.GEMINI_API_KEY; // Ensure it's removed
    req.body.messages = [{ role: 'user', text: 'Hi' }];

    await generateChatResponse(req, res, next);

    expect(res.statusCode).toBe(500);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toContain('Gemini API key is missing');
  });

  it('should successfully fetch products and generate AI response', async () => {
    process.env.GEMINI_API_KEY = 'test_api_key';
    req.body.messages = [{ role: 'user', text: 'Hi' }];

    // Mock Product lookup
    const mockLean = jest.fn().mockResolvedValue([
      { _id: '1', name: 'Laptop', price: 999, category: 'Computing', stock: 10 }
    ]);
    const findSpy = jest.spyOn(Product, 'find').mockReturnValue({ lean: mockLean });

    await generateChatResponse(req, res, next);

    expect(findSpy).toHaveBeenCalledWith({ isAvailable: { $ne: false } });
    
    // Check successful response parsing
    const responseData = res._getJSONData();
    expect(res.statusCode).toBe(200);
    expect(responseData.response).toBe('Hello from mock Gemini AI!');

    findSpy.mockRestore();
  });
  
  it('should handle AI service failures gracefully', async () => {
    process.env.GEMINI_API_KEY = 'test_api_key';
    req.body.messages = [{ role: 'user', text: 'Hi' }];

    const mockLean = jest.fn().mockResolvedValue([]);
    const findSpy = jest.spyOn(Product, 'find').mockReturnValue({ lean: mockLean });

    // Make the AI generation fail
    mockGenerateContent.mockRejectedValueOnce(new Error('AI API rate limit'));

    await generateChatResponse(req, res, next);

    expect(res.statusCode).toBe(500);
    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(next.mock.calls[0][0].message).toContain('taking a break');

    findSpy.mockRestore();
  });
});
