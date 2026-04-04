import asyncHandler from 'express-async-handler';
import { GoogleGenAI } from '@google/genai';
import Product from '../models/Product.js';

// @desc    Generate AI chat response
// @route   POST /api/chat
// @access  Public
export const generateChatResponse = asyncHandler(async (req, res) => {
  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    res.status(400);
    throw new Error('Messages array is required');
  }

  // Check for API key
  if (!process.env.GEMINI_API_KEY) {
    res.status(500);
    throw new Error('Gemini API key is missing. Please add GEMINI_API_KEY to your backend .env file.');
  }

  // Fetch all active products to feed to the AI context
  const products = await Product.find({ isAvailable: { $ne: false } }).lean();
  
  // Format products for prompt
  const productCatalog = products.map(p => 
    `- ${p.name} ($${p.price}) | Category: ${p.category} | Stock: ${p.stock > 0 ? 'In Stock' : 'Out of Stock'} | ID: ${p._id}`
  ).join('\n');

  // Build the system instructions
  const systemInstruction = `You are a helpful and polite virtual AI sales assistant for an electronic store called E-Core.
Your goal is to assist customers, answer their questions, and recommend products from our live catalog.
Format your responses using Markdown. Use bold for product names.
Do not recommend products that are not in the catalog below.
If a customer asks about a product we don't have, politely let them know and suggest an alternative from our catalog if possible.
Keep responses concise, friendly, and helpful. Mention prices in USD ($).

Our current Live Product Catalog:
${productCatalog}

Additional Store Policies:
- Orders can be tracked if the user goes to the Orders page.
- Returns are accepted within 30 days for electronics.
- Contact support is available at support@ecore.com.
- Shipping is free over $500.`;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    // Convert generic chat history to Gemini's expected format if using chat sessions, 
    // or just pass as an array of contents to generateContent
    
    // We will map exactly to the format required by the Google Gen AI SDK
    const formattedMessages = messages.map(msg => ({
      role: msg.role === 'bot' ? 'model' : 'user',
      parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: formattedMessages,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({
      response: response.text,
    });
  } catch (error) {
    console.error('Gemini AI Error:', error);
    res.status(500);
    throw new Error('Our AI agent is currently taking a break. Please try again later.');
  }
});
