import './App.css';
import React, {useEffect, useState} from 'react';
import Axios from 'axios';




 function App () {
  const [search, setSearch] = useState("Nothing...");
  const [linkVal, setLinkVal] = useState("");
  const [data, setData] = useState("");
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
    })
    .catch(error =>{
      console.error(error);
    });
    
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
        <p>{search}</p>
        <p>{linkVal}</p>
        <p>{data}</p>
      </header>
    </div>
  );
 }

export default App;

