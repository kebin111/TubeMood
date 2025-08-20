import './App.css';
import React, {useEffect, useState} from 'react';
import Axios from 'axios';




 function App () {
  const [search, setSearch] = useState("Nothing...");
  const [linkVal, setLinkVal] = useState("");
  const [data, setData] = useState("");
  const [confidence, setConfidence] = useState([]);
  const [counts, setCounts] = useState([]);
  // link post
  

  
  function buttonClick(){
    console.log("CHECKING");
    setSearch(prevSearch => prevSearch = "Searching...");
    postLink();
  }

  const change = event => {
    const newLinkVal = event.target.value;
    setLinkVal(prevLinkVal => prevLinkVal = newLinkVal);
  }

  const getData = async() => {
    const response = await Axios.get("http://localhost:5000/getData");
    setData(response.data);
  }

  const postLink = async() => {
    await Axios.post("http://localhost:5000/YTLink", {link : linkVal})
    .then(response => {
      console.log(response.data);
      setConfidenceScore(response.data.avgs);
      const arr = [];

      arr.push(response.data.s_map.L0.length);
      arr.push(response.data.s_map.L1.length);
      arr.push(response.data.s_map.L2.length);
      setCounts(arr);
      console.log(counts);
    })
    .catch(error =>{
      console.error(error);
    });
    
  }

  const setConfidenceScore = (data) => {
    setConfidence(data);
  }

  const setLabelCounts = (data) => {
    setCounts(data);
  }

  useEffect(() => {
    getData();
  }, [] );

  return (
    <div className="App">
      <header className="App-header">
        <div className="text-container">
        <h2>is this video worth watching? let the comments decide...</h2>
        </div>

        <div className="input-container">
          <input value={linkVal} onChange={change} id="link-input" placeholder="Paste Youtube video link here..." />
          <button id="link-btn" onClick={buttonClick}>Analyze</button>
        </div>

        {/* FOR DEBUGGING */}
        {/* <p>{search}</p> */}
        {/* <p>{linkVal}</p> */}
        {/* <p>{data}</p> */}

        <p>COUNT OUT OF 100:</p>
        <p>NEGATIVE: {counts[0]}</p>
        <p>NEUTRAL: {counts[1]}</p>
        <p>POSITIVE: {counts[2]}</p>

        <p>CONFIDENCE SCORE NEGATIVE: {confidence[0]}</p>
        <p>CONFIDENCE SCORE NEUTRAL: {confidence[1]}</p>
        <p>CONFIDENCE SCORE POSITIVE: {confidence[2]}</p>
      </header>
    </div>
  );
 }

export default App;

