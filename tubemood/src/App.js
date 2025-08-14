import logo from './logo.svg';
import './App.css';
import React, {useState} from 'react';

// export function NavBar(){
//   return (
//     <div className="nav">

//       <p>TubeMood</p>
//       <div className="navbar">
//       <a>About</a>
//       <a>API</a>
//       <a>Contact</a>
//       </div>
      
//     </div>
//   );
// }

 function App () {
  const [search, setSearch] = useState("Nothing...");
  const [linkVal, setLinkVal] = useState("");

  
  function buttonClick(){
    console.log("CHECKING");
    setSearch(prevSearch => prevSearch = "Searching...");
  }

  const change = event => {
    const newLinkVal = event.target.value;
    setLinkVal(prevLinkVal => prevLinkVal = newLinkVal);
  }
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
      </header>
    </div>
  );
 }

export default App;

