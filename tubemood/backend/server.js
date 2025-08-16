

import express from 'express';
import axios from 'axios';
import cors from 'cors';
import 'dotenv/config';
import fetch from 'node-fetch';

import http from 'http';
import querystring from 'querystring';
import url from 'url';

import { pipeline, env } from '@huggingface/transformers';
import { InferenceClient } from '@huggingface/inference';

const app = express();
app.use(cors());
app.use(express.json());

const HF_API_TOKEN = process.env.ACCESS_TOKEN;
const MODEL = process.env.HUGGINGFACE_API_KEY;
const comments = ["I love this video!", "This is terrible...", "Meh, it’s okay.", "I hate this", "Don't watch this!"];

const API_URL = `https://api-inference.huggingface.co/models/${MODEL}`;

const inference = new InferenceClient(HF_API_TOKEN);


// Analyze function using Hugging Face API
async function analyze(comment) {
    console.log("analyzing...");
    console.log(MODEL);

    const result = await inference.textClassification({
      model: MODEL,
      inputs: comment
    });

    console.log(result);
}

app.get('/getData', (req, res) => {
  res.send('server is connected');
});

app.post('/YTLink', (req, res) => {
    const {link} = req.body;
    console.log(link);
});

// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
    //analyze(comments);
    
});















// Analyze endpoint
// app.post('/analyze', async (req, res) => {
//   try {
//     const { videoId } = req.body;

//     // 1. Fetch YouTube comments
//     const youtubeUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=20&key=${process.env.YOUTUBE_API_KEY}`;
//     const ytRes = await axios.get(youtubeUrl);

//     const comments = ytRes.data.items.map(
//       item => item.snippet.topLevelComment.snippet.textDisplay
//     );

//     // 2. Send comments to Hugging Face API
//     const hfPromises = comments.map(comment =>
//       axios.post(
//         'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english',
//         { inputs: comment },
//         { headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` } }
//       )
//     );

//     const hfResults = await Promise.all(hfPromises);

//     // 3. Count sentiment
//     let positive = 0, negative = 0;
//     hfResults.forEach(r => {
//       const label = r.data[0].label;
//       if (label === 'POSITIVE') positive++;
//       else negative++;
//     });

//     res.json({
//       positive,
//       negative,
//       total: comments.length
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Error analyzing comments' });
//   }
// });