const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Gemini AI
const API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Generate healthcare advice using Gemini AI
async function generateHealthcareAdvice(userInput) {
  try {
    // Create prompt for Gemini
    const prompt = `
      You are a healthcare support chatbot. Your role is to provide general advice on healthcare issues for patients and doctors. 
      You do not prescribe medication or provide medical diagnoses. Instead, you offer helpful tips, guidance, and information 
      about healthcare topics.

      User Input: "${userInput}"

      Respond in a friendly and professional tone. Provide advice or guidance based on the user's input. If the input is unclear, 
      ask clarifying questions. Format your response as a structured JSON object following this schema:
      {
        "advice": "Your advice or guidance here",
        "additionalInfo": "Optional additional information or resources",
        "followUpQuestions": ["Optional follow-up question 1", "Optional follow-up question 2"]
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log('Raw AI response:', responseText);

    // Parse the AI response into JSON
    try {
      return JSON.parse(responseText);
    } catch (err) {
      console.log('Direct JSON parsing failed, trying to extract JSON from text');

      // Extract JSON using regex pattern matching
      const jsonRegex = /{[\s\S]*}/g;
      const jsonMatch = responseText.match(jsonRegex);

      if (jsonMatch && jsonMatch[0]) {
        return JSON.parse(jsonMatch[0]);
      }

      throw new Error('Could not extract valid JSON from AI response');
    }
  } catch (error) {
    console.error('Error generating healthcare advice:', error);
    throw new Error('Failed to generate healthcare advice');
  }
}

// API endpoint for healthcare chatbot
app.post('/api/healthcareChat', async (req, res) => {
  try {
    const { userInput } = req.body;
    console.log('Received user input:', userInput);

    if (!userInput || userInput.trim().length === 0) {
      return res.status(400).json({ error: 'User input is required' });
    }

    // Generate healthcare advice using Gemini AI
    const advice = await generateHealthcareAdvice(userInput);

    res.json(advice);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to generate healthcare advice' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});