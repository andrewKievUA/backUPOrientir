import './App.css';
import Button from '@mui/material/Button';
import React, { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import filterArray from '../../components/filterArray';
import KeyHandler from '../../components/KeyHandler'
import tema from './tema'
import w1 from './questions';
// import Reader from "./Reader"    <Reader/>

const Words = () => {
  const weatherWords = w1

  let weatherWordsObj = []
  const [correctAnswer, setCorrectAnswer] = React.useState(0)
  const [wrongAnswer, setWrongAnswer] = React.useState([])
  const [study, setStudy] = React.useState(false)
  const [questionNumber, setQuestionNumber] = React.useState(0)
  const [tematicNum, setTematicNum] = React.useState(0)
  
  if (tematicNum === weatherWords.length - 1) { setTematicNum(0) }
  const changeTematic = () => {
    //console.log("changeTematic");
    setTematicNum(tematicNum + 1)
    weatherWordsObj = filterArray(weatherWords[tematicNum + 1])
    setar(weatherWordsObj)
    setQuestionNumber(0)
  }
  const changeTematic2 = () => {
    setTematicNum(tematicNum - 1)
    weatherWordsObj = filterArray(weatherWords[tematicNum - 1])
    setar(weatherWordsObj)
    setQuestionNumber(0)
  }
  weatherWordsObj = filterArray(weatherWords[tematicNum])
  const [ar, setar] = React.useState(weatherWordsObj)
   
  if (questionNumber === ar.length - 1 && !study ) { changeTematic() }
  if (questionNumber === ar.length - 1 && study ) { setQuestionNumber(0) }

  const speak = (input) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(input);
    utterance.lang = 'de-DE'; // Установите язык на немецкий (deutsch)
    utterance.rate = 1
    synth.speak(utterance);
  };
  const speakRus = (input) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(input);
    utterance.lang = 'ru-RU'; // Установите язык на немецкий (deutsch)
    utterance.rate = 1.3
    synth.speak(utterance);
  };




  const activateLasers = (i, b) => {
    if (i === b) {
            setQuestionNumber(questionNumber + 1)
      setCorrectAnswer(correctAnswer + 1)
    } else {
      setWrongAnswer([...wrongAnswer, ar[questionNumber].germ + " " + b])  //[...myArray2, 4]
      //speak(ar[questionNumber].germ)
      speakRus(ar[questionNumber].rus)
    }
  }

  const MyComponenSound = () => {
    if (study === true) {

      //setIsRunning()
      speak(ar[questionNumber].germ)
      speak(ar[questionNumber].germ)
      speakRus(ar[questionNumber].rus)
    } else {
      speak(ar[questionNumber].germ)
    }
    return <div></div>;
  };

  const Counter = () => {

  
    useEffect(() => {
      let interval = null;
  
      if (study) {
        speak(ar[questionNumber].germ)
        speakRus(ar[questionNumber].rus)
        interval = setInterval(() => {
        
          setQuestionNumber(questionNumber + 1)

        }, 8000);
      } else {
        clearInterval(interval);
      }
  
      return () => {
        clearInterval(interval);
      };
    }, []);
    
    return (
      <div>

      </div>
    );
  };

  return (
    <>
    
      <Counter/>
          {questionNumber}/{ar.length}{" "}{tema[tematicNum]}
      <Button size="small" color="inherit" variant="outlined" onClick={changeTematic}> Сменить тематику</Button>
      <Button size="small" color="inherit" variant="outlined" onClick={changeTematic2}> Пред тематика</Button>
      <Button size="small" color="inherit" variant="outlined" onClick={() => { setStudy(!study) }}>  {study ? 'Выключить' : 'Обучение'}</Button>
      {wrongAnswer.length? correctAnswer + "/" + wrongAnswer.length + "/" + Math.round((correctAnswer / wrongAnswer.length + 1)) + "%": null}
      <div className="App">
        <Card sx={{ minWidth: 275, backgroundColor: 'gray' }}>
          <CardContent>
            <KeyHandler
              ar={ar}
              questionNumber={questionNumber}
              activateLasers={activateLasers}
              speak={speak}
              speakRus={speakRus}
            />
            {wrongAnswer.map((item, index) => { return (<span key={index}>{"  [" + index + "-"}{item + "]"}</span>) })}
            <Typography sx={{ color: 'white' }} variant="h3" component="div">{ar[questionNumber].germ}</Typography>
            <Typography sx={{ mb: 1.5, color: 'white' }} color="text.secondary">{ar[questionNumber].trans}</Typography>
            <Typography variant="body2">
              {ar[questionNumber].ansRU.map((ans, index) => <div key={Math.random()}>
                <Button color="inherit" variant="outlined" size="large"
                  style={
                    {
                      fontSize: '25px',
                      width: '320px',  // Устанавливаем начальную ширину кнопки
                      height: '100px', // Устанавливаем начальную высоту кнопки
                      color: 'white', // Изменяем цвет текста на белый
                    }
                  }
                  onClick={() => activateLasers(ans, ar[questionNumber].rus)}>{ans}
                </Button> {" "}</div>)}
              <MyComponenSound />
              <br />
            </Typography>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default Words;
