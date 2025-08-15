const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Analyze endpoint
app.post('/analyze', async (req, res) => {
  try {
    const { videoId } = req.body;

    // 1. Fetch YouTube comments
    const youtubeUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=20&key=${process.env.YOUTUBE_API_KEY}`;
    const ytRes = await axios.get(youtubeUrl);

    const comments = ytRes.data.items.map(
      item => item.snippet.topLevelComment.snippet.textDisplay
    );

    // 2. Send comments to Hugging Face API
    const hfPromises = comments.map(comment =>
      axios.post(
        'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english',
        { inputs: comment },
        { headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` } }
      )
    );

    const hfResults = await Promise.all(hfPromises);

    // 3. Count sentiment
    let positive = 0, negative = 0;
    hfResults.forEach(r => {
      const label = r.data[0].label;
      if (label === 'POSITIVE') positive++;
      else negative++;
    });

    res.json({
      positive,
      negative,
      total: comments.length
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error analyzing comments' });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
