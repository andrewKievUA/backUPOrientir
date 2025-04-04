import './App.css';
import React, { useState, useEffect } from 'react';
import DisableScreenDimming from "./components/DisableScreenDimming"
import sound from './components/phon_128.mp3'
import Navigation from "./components/Navigation"
// import  { db } from "./firebase/firebase"

function App() {

  // const [data, setData] = useState([]);

  // useEffect(() => {
  //   // Пример запроса данных из базы данных
  //   db.ref('q').once('value', (snapshot) => {
  //     const fetchedData = snapshot.val();
  //     setData(fetchedData);
  //   });
  // }, []);


  return (
    <div className="App">
      <Navigation/>
      <DisableScreenDimming />

      <div style={{ position: 'fixed', bottom: '10px', left: '50%', transform: 'translateX(-50%)' }}>
        <audio src={sound} controls loop />
      </div>
    </div>
  );
}

export default App;
