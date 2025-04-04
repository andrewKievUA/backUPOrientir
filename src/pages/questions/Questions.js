
import React, { useState } from 'react';
import Button from '@mui/material/Button';
import questions from './questionsData';
import Typography from '@mui/material/Typography';
import VerbConjugations from './VerbConjugations';

const Questions = () => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const handleAnswerClick = (selectedAnswer) => {
        const currentQuestion = questions.questions[currentQuestionIndex];
        if (selectedAnswer === currentQuestion.answer) {
          // Answer is correct, move to the next question
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          // Handle incorrect answer behavior here, if needed
          // For example, display a message to the user
        }
      };

// (Откуда ты?)

const currentQuestion = questions.questions[currentQuestionIndex];

return (
    <div>      
      {currentQuestion ? (
        <div>              
                <VerbConjugations />
             <Typography sx={{ mb: 1.5, color: 'white' }} variant="h4" component="div">{currentQuestion.questionRus}</Typography>
             <Typography sx={{ mb: 1.5, color: 'white' }} variant="h4" color="text.secondary">{currentQuestion.questionGerm}</Typography>

          {Object.keys(currentQuestion).map((key) => {
            if (key.startsWith('v')) {
              const option = currentQuestion[key];

              return (
                <Button color="inherit" variant="outlined" size="large"
                  style={
                    {
                      fontSize: '25px',
                      width: '320px',  // Устанавливаем начальную ширину кнопки
                      height: '100px', // Устанавливаем начальную высоту кнопки
                      color: 'white', // Изменяем цвет текста на белый
                    }
                  }
                  key={key}
                  onClick={() => handleAnswerClick(option)}>
                   {option}
                </Button>
              );
            }
            return null;
          })}
        </div>
      ) : (
        <p>Quiz completed!</p>
      )}
    </div>
  );
}

export default Questions;