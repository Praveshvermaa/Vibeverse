const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const router = express.Router();

// Configuration for OpenAI API
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Route for AI-generated image
router.post('/aigenerator', async (req, res) => {
    try {
        const { prompt } = req.body;

        // Check if the prompt is provided
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Generate image using OpenAI API
        const responseAi = await openai.createImage({
            prompt: prompt,
            n: 1,
            size: '1024x1024',
            response_format: 'b64_json',
        });

        // Check if the response has data
        if (responseAi.data && responseAi.data.data[0] && responseAi.data.data[0].b64_json) {
            const image = responseAi.data.data[0].b64_json;
            return res.status(200).json({ photo: image });
        } else {
            return res.status(500).json({ error: 'Failed to generate image' });
        }
    } catch (error) {
        console.error('OpenAI Error:', error.response?.data || error.message);
        res.status(500).json({success:false, error: 'Internal Server Error' });
    }
});

module.exports = router;
