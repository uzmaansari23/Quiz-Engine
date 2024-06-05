import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import './Quiz.css'

const Quiz = () => {
  const { subject = '' } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState(-1);
  const [userAnswers, setUserAnswers] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Fetch quiz questions for the selected subject
  useEffect(() => {
    const fetchQuestions = async () => {
      let id = '';
      if (subject === 'html') {
        id = "1";
      } else if (subject === 'css') {
        id = "2";
      } else if (subject === 'javascript') {
        id = "3";
      } else if (subject === 'bootstrap') {
        id = "4";
      }

      try {
        const response = await fetch(`http://localhost:5000/questions/${id}`);
        const data = await response.json();
        setQuestions(data);
        // Initialize userAnswers array with default values
        setUserAnswers(Array(data.length).fill({ answer: '' }));
      } catch (error) {
        console.error('Error fetching questions:', error);
        alert('An error occurred while fetching questions');
      }
    };
    fetchQuestions();
  }, [subject]);


 // Call calculateScore when correctAnswers are fetched
useEffect(() => {
  if (correctAnswers.length > 0 && userAnswers.length === questions.length) {
    const { score, result } = calculateScore();
    setScore(score);
  }
}, [correctAnswers, userAnswers, questions]);



// Function to fetch correct answers
const fetchCorrectAnswers = async () => {
  // Ensure userAnswers array is properly initialized for all questions
  if (userAnswers.length !== questions.length) {
    setUserAnswers(Array(questions.length).fill({ answer: '' }));
  }
  // Fetch correct answers
  let id = '';
  if (subject === 'html') {
    id = "1";
  } else if (subject === 'css') {
    id = "2";
  } else if (subject === 'javascript') {
    id = "3";
  } else if (subject === 'bootstrap') {
    id = "4";
  }

  try {
    const response = await fetch(`http://localhost:5000/correct_answers/${id}`);
    const data = await response.json();
    console.log("Correct Answers:", data); // Add this line to check correct answers
    setCorrectAnswers(data);
  } catch (error) {
    console.error('Error fetching correct answers:', error);
    alert('An error occurred while fetching correct answers');
  }
};


const handleSubmitQuiz = async () => {
  await fetchCorrectAnswers(); // Wait for correct answers to be fetched
  setShowResults(true);
};


// Function to compare user answers with correct answers and calculate score
const calculateScore = () => {
  let score = 0;
  const result = [];
  console.log("User Answers:", userAnswers); 
  console.log("Correct Answers:", correctAnswers); 
  for (let i = 0; i < userAnswers.length; i++) {
    const userAnswer = userAnswers[i].answer;
    const correctAnswer = correctAnswers[i].answer;
    const isCorrect = userAnswer.toString() === correctAnswer;

    // Increment score if answer is correct and not empty
    if (userAnswer !== '' && isCorrect) {
      score++;
    }
    // Prepare result object
    result.push({
      question: questions[i].question_text,
      userAnswer: userAnswer === '' ? 'No answer selected' : questions[i][`option_${userAnswer + 1}`],
      correctAnswer: questions[i][`option_${correctAnswer + 1}`],
      isCorrect: isCorrect,
    });
  }
  console.log("Score:", score);
  return { score, result };
};



const handleOptionSelect = (optionText) => {
  setUserAnswers(prevAnswers => {
    const updatedAnswers = [...prevAnswers];
    updatedAnswers[currentQuestionIndex] = { answer: optionText };
    return updatedAnswers;
  });

  setSelectedOptionIndex(optionText);
  
  setUserAnswers(prevAnswers => {
    const updatedAnswers = [...prevAnswers];
    updatedAnswers[currentQuestionIndex] = { answer: optionText };
    return updatedAnswers;
  });
};


// Function to display the next question
const handleNextQuestion = () => {
  setCurrentQuestionIndex(prevIndex => prevIndex + 1);
  setSelectedOptionIndex(userAnswers[currentQuestionIndex + 1]?.answer ?? -1); // Retain selected option for next question
};

// Function to display the previous question
const handlePrevQuestion = () => {
  setCurrentQuestionIndex(prevIndex => prevIndex - 1);
  setSelectedOptionIndex(userAnswers[currentQuestionIndex - 1]?.answer ?? -1); // Retain selected option for previous question
};



const handleEditOption = (index) => {
  setCurrentQuestionIndex(index);
  setSelectedOptionIndex(userAnswers[index]?.answer ?? -1);
  setShowPreview(false); // Hide preview when editing an answer
};


return (
  <div className="bg4">
    <div>
      {!showPreview && !showResults && questions.length > 0 && (
        <>
          <div>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>{subject.toUpperCase()}</h1>
          </div>
          <div className="qPanel mt-5" style={{ backgroundColor: '#F3EAAF', marginTop: 0, marginLeft: 400, marginRight: 400, padding: 50, borderRadius: 15 }}>
            <div className="ques" id="question" style={{ fontSize: '20pt' }}>
              Q{currentQuestionIndex + 1}: {questions[currentQuestionIndex].question_text}
            </div>
            <div>
              <input
                className="answer"
                type="radio"
                id="opt1"
                name="options"
                onClick={() => handleOptionSelect(questions[currentQuestionIndex].option_1)}
                checked={selectedOptionIndex === questions[currentQuestionIndex].option_1}
              />
              <span id="optt1">{questions[currentQuestionIndex].option_1}</span>
            </div>
            <div>
              <input
                className="answer"
                type="radio"
                id="opt2"
                name="options"
                onClick={() => handleOptionSelect(questions[currentQuestionIndex].option_2)}
                checked={selectedOptionIndex === questions[currentQuestionIndex].option_2}
              />
              <span id="optt2">{questions[currentQuestionIndex].option_2}</span>
            </div>
            <div>
              <input
                className="answer"
                type="radio"
                id="opt3"
                name="options"
                onClick={() => handleOptionSelect(questions[currentQuestionIndex].option_3)}
                checked={selectedOptionIndex === questions[currentQuestionIndex].option_3}
              />
              <span id="optt3">{questions[currentQuestionIndex].option_3}</span>
            </div>
            <div style={{ marginTop: 20 }}>
              {currentQuestionIndex > 0 && (
                <button className="btn btn-primary me-2" onClick={handlePrevQuestion}>
                  Previous
                </button>
              )}
              {currentQuestionIndex < questions.length - 1 ? (
                <button className="btn btn-primary" onClick={handleNextQuestion}>
                  Next
                </button>
              ) : (
                <button className="btn btn-success" onClick={handleSubmitQuiz}>
                  Submit
                </button>
              )}
            </div>
          </div>
        </>
      )}
      {questions.length === 0 && <div>Loading...</div>}
      {showResults && (
        <div>
          <h2 style={{ fontSize: '40px' }}>Quiz Results</h2>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Your Answer</th>
                <th>Correct Answer</th>
              </tr>
            </thead>
            <tbody>
              {userAnswers.map((userAnswer, index) => (
                <tr key={index}>
                  <td>{questions[index].question_text}</td>
                  <td>{userAnswer.answer === '' ? 'No answer selected' : userAnswer.answer}</td>
                  <td>{correctAnswers[index].answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3 style={{ textAlign: 'center', fontSize: '40px', marginTop: '10px' }}>
            Your Score: {calculateScore().score} / {questions.length}
          </h3>
          <center>
            <Link to="/welcome">
              <button className="btn btn-success">Exit Quiz</button>
            </Link>
          </center>
        </div>
      )}
      {!showResults && (
        <center>
          <button className="btn btn-success mt-2" onClick={() => setShowPreview(!showPreview)}>
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
        </center>
      )}
      {showPreview && (
        <div>
          <h1 style={{ textAlign: 'center' }}>Preview</h1>
          <table className="styled-table">
            <thead>
              <tr>
                <th>Question</th>
                <th>Selected Answer</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question, index) => (
                <tr key={index}>
                  <td>{question.question_text}</td>
                  <td>{userAnswers[index]?.answer === '' ? 'No answer selected' : userAnswers[index]?.answer}</td>
                  <td>
                    <button className="btn btn-primary" onClick={() => handleEditOption(index)}>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
);

};

export default Quiz;