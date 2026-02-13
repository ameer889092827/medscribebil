import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from dist directory (Vite build output)
app.use(express.static(path.join(__dirname, 'dist')));

// API Routes
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model, reasoning, temperature } = req.body;

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ 
        error: "Invalid input. 'messages' array is required." 
      });
    }

    // Check for API key
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    if (!OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY is not set in environment variables');
      return res.status(500).json({ 
        error: "Server Configuration Error: API Key missing" 
      });
    }

    // Prepare request to OpenRouter
    const requestBody = {
      model: model || "openai/gpt-oss-120b:free",
      messages: messages,
      ...(reasoning !== undefined && { reasoning: { enabled: reasoning } }),
      ...(temperature !== undefined && { temperature }),
    };

    // Call OpenRouter API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": req.headers.origin || "http://localhost:3000",
        "X-Title": "MedScribe"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`OpenRouter API Error: ${response.status} - ${errorText}`);
      return res.status(response.status).json({ 
        error: `OpenRouter API Error: ${errorText}` 
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "";

    // Return success response
    res.status(200).json({ content });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ 
      error: "Internal Server Error",
      message: error.message 
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Serve index.html for all non-API routes (SPA fallback)
app.get('*', (req, res) => {
  // Only serve index.html for non-API routes
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/chat`);
});
