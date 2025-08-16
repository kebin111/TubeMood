//this is where the api will be called and the analysis will happen

const fetch = require("node-fetch");

async function analyze(comments, MODEL, HF_API_TOKEN){
    const response = await fetch(`https://api-inference.huggingface.co/models/${MODEL}`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${HF_API_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(comments)

    });

    const results = await response.json();
    console.log(results);

    
}

module.exports = { analyze };