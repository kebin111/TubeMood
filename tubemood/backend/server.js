

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
//const comments = ["I love this video!", "This is terrible...", "Meh, it’s okay.", 
//                                              "I hate this", "Don't watch this!"];

const YT_API_KEY = process.env.YOUTUBE_API_KEY;

const inference = new InferenceClient(HF_API_TOKEN);

const avg = score => score.reduce((a, b) => a + b) / score.length;


// Analyze function using Hugging Face API
async function analyze(comment) {
    console.log("analyzing...");
    console.log(MODEL);

    const result = await inference.textClassification({
      model: MODEL,
      inputs: comment
    });

    //console.log(result);

    return result;
}

async function fetchComments(vidLink){
  const videoId = await getVideoId(vidLink);
  console.log(videoId);
  try{
    const res = await axios.get('https://www.googleapis.com/youtube/v3/commentThreads', {
    params: {
      part: 'snippet',
      videoId: videoId,
      maxResults: 100,
      key: YT_API_KEY,
      order: "relevance",
    }
   });

   const comments = res.data.items.map(item => ({
      username: item.snippet.topLevelComment.snippet.authorDisplayName,
      commentText:  item.snippet.topLevelComment.snippet.textOriginal,
      }));

      //console.log(comments);
      return comments;
  } catch (error) {
    console.error(err);
    return null;
  }

  
}

async function getVideoId(url){
  try {
    const parsedUrl = new URL(url);

    // Case 1: Standard YouTube link (watch?v=...)
    if (parsedUrl.hostname.includes('youtube.com')) {
      return parsedUrl.searchParams.get('v');
    }

    // Case 2: Shortened youtu.be link (youtu.be/abcd1234)
    if (parsedUrl.hostname === 'youtu.be') {
      return parsedUrl.pathname.slice(1);
    }

    // Case 3: Embed links (youtube.com/embed/abcd1234)
    if (parsedUrl.pathname.startsWith('/embed/')) {
      return parsedUrl.pathname.split('/embed/')[1];
    }

    return null; // No valid videoId found
  } catch (err) {
    console.error('Invalid URL:', url);
    return null;
  }
}

function cleanStats(rawScore){
  const scoreMAP = {
    L0: [],
    L1: [],
    L2: [],
  };
  rawScore.forEach(e => {
      switch(e.label){
        case 'LABEL_0':
          scoreMAP.L0.push(e.score);
          break;
        case 'LABEL_1':
          scoreMAP.L1.push(e.score);
          break;
        case 'LABEL_2':
          scoreMAP.L2.push(e.score);
          break;
      }
  });

  
  //counts of each label
  // console.log("\nCOUNTS OUT OF 100\n");
  // console.log("NEGATIVE: ", scoreMAP.L0.length);
  // console.log("NEUTRAL: ", scoreMAP.L1.length);
  // console.log("POSITIVE: ", scoreMAP.L2.length);

  //need total average score
  // console.log("\nSCORES\n");
  // console.log("AVG NEGATIVE: ",avg(scoreMAP.L0));
  // console.log("AVG NEUTRAL: ",avg(scoreMAP.L1));
  // console.log("AVG POSITIVE: ",avg(scoreMAP.L2));
  // console.log(scoreMAP.L0);

  return scoreMAP;
}

function avgScores(map){
  const avgArr = [];



  avgArr.push(avg(map.L0));
  avgArr.push(avg(map.L1));
  avgArr.push(avg(map.L2));
  


  return avgArr;

}

app.get('/getData', (req, res) => {
  res.send('server is connected');
});

app.post('/YTLink', async (req, res) => {
    const link = req.body.link;
    console.log(link);
    //console.log(getVideoId(link));
    try{
      const entries =  await fetchComments(link);
      if (entries){
        const e_arr = entries.map(e => e.commentText);
      
      const r_score =  await analyze(e_arr); // raw score in sentiment analysis of HF
      const s_map = cleanStats(r_score);
      const avgs = avgScores(s_map);
      //console.log(r_score);
       // console.log(avgs);

       return res.json({
        success: true,
        avgs, 
        s_map
       });
      }else{
        console.log("no comments found.");
        return res.status(404).json({ success: false, message: "No comments found." });
      }
     
    }catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Something went wrong" });
    }

    
    // res.send("link received!");
 
});

// Start server
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
   
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