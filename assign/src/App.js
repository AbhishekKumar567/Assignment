import logo from './logo.svg';
import React, { useState, useEffect } from 'react';
import './App.css';
import questionsData from './questions.json';

function App() {

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showWelcome, setShowWelcome] = useState(true);
  const [showThankYou, setShowThankYou] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);

  const startSurvey = () => {
    setShowWelcome(false);
    setCurrentQuestion(0);
  };

  const nextQuestion = () => {
    if (currentQuestion < questionsData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedRating(null);
    } else {
      // If it's the last question, showing confirmation dialog
      const confirmSubmission = window.confirm('Do you want to submit the survey?');
      if (confirmSubmission) {
        // Save completion flag in local storage
        localStorage.setItem('surveyStatus', 'COMPLETED');
        localStorage.setItem('answers', JSON.stringify(answers));
        // Show thank you screen
        setShowThankYou(true);
        // Reset after 5 seconds
        setTimeout(() => {
          setShowThankYou(false);
          setShowWelcome(true);
          setCurrentQuestion(0);
          setSelectedRating(null);
        }, 5000);
      }
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedRating(null);
    }
  };

  const handleRatingClick = (rating) => {
    setSelectedRating(rating);
    handleAnswer(rating);
  };

  const handleAnswer = (answer) => {
    // Store the answer in local storage
    const questionId = questionsData[currentQuestion].id;
    setAnswers({
      ...answers,
      [questionId]: answer,
    });
  };

  useEffect(() => {
    // Add logic to identify each customer's session if needed
    // For simplicity, you can use a timestamp or generate a unique ID
    const sessionId = Date.now();
    localStorage.setItem('sessionId', sessionId);
  }, []);

  if (showWelcome) {
    return (
      <div className="center">
        <h1>Welcome to the Survey</h1>
        <button onClick={startSurvey}>Start</button>
      </div>
    );
  }

  if (showThankYou) {
    return <div className="center"><h1>Thank you for your time!</h1>;</div>
  }

  return (
    <div className="center">
      <h2>Question {currentQuestion + 1}/{questionsData.length}</h2>
      <p>{questionsData[currentQuestion].question}</p>
      {questionsData[currentQuestion].type === 'rating' && (
        <div>
          {[1, 2, 3, 4, 5].map((rating) => (
            <span
              key={rating}
              className={`rating-circle ${selectedRating === rating ? 'selected' : ''}`}
              onClick={() => handleRatingClick(rating)}
            >
              {rating}
            </span>
          ))}
        </div>
      )}
      {questionsData[currentQuestion].type === 'text' && (
        <textarea onChange={(e) => handleAnswer(e.target.value)} />
      )}
      <div className="button-container">
      <button onClick={previousQuestion}>Previous</button>
      <button onClick={nextQuestion}>Next</button>
      </div>
    </div>
  )
}

export default App;
