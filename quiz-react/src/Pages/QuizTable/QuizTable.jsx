import React, { useState, useEffect } from 'react';
import './QuizTable.css'; // Make sure to import your CSS file

function QuizTable() {
  const [selectedQuiz, setSelectedQuiz] = useState('default');
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editedQuestion, setEditedQuestion] = useState({
    question_id: '',
    subject_name: '',
    question_text: '',
    option_1: '',
    option_2: '',
    option_3: '',
    answer: ''
  });

  useEffect(() => {
    if (selectedQuiz !== 'default') {
      fetchQuestions(selectedQuiz);
    }
  }, [selectedQuiz]);

  const fetchQuestions = async (selectedValue) => {
    try {
      const response = await fetch('http://localhost:5000/getData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ subject_name: selectedValue })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const data = await response.json();
      setQuestions(data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSelectChange = (e) => {
    setSelectedQuiz(e.target.value);
  };

  const handleEditButtonClick = (question) => {
    setEditingQuestion(question.question_id);
    setEditedQuestion(question);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedQuestion({ ...editedQuestion, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/updateQuestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedQuestion)
      });

      if (!response.ok) {
        throw new Error('Failed to update question');
      }

      // Reload the questions after update
      fetchQuestions(selectedQuiz);
      setEditingQuestion(null);
    } catch (error) {
      console.error('Error updating question:', error);
    }
  };

  return (
    <div className='bg7'>
      <div className="container">
        <h1>Select Quiz:</h1>
        <select id="quizSelect" value={selectedQuiz} onChange={handleSelectChange}>
          <option value="default">Choose Subject</option>
          <option value="HTML">HTML</option>
          <option value="CSS">CSS</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Bootstrap">Bootstrap</option>
        </select>
      </div>
      <h1 style={{ textAlign: 'center', fontWeight: 800, fontSize: '50px', color: 'rgb(128, 124, 124)', fontFamily: 'cursive' }}>Questions</h1>

      <table border="1" id="table" style={{ height: '80vh', width: '100%' }}>
        <thead style={{ height: '7vh' }}>
          <tr>
            <th>QuestionID</th>
            <th>Subject</th>
            <th>Question</th>
            <th>Option 1</th>
            <th>Option 2</th>
            <th>Option 3</th>
            <th>Answer</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((question) => (
            <tr key={question.question_id}>
              <td>{question.question_id}</td>
              <td>{question.subject_name}</td>
              <td>{question.question_text}</td>
              <td>{question.option_1}</td>
              <td>{question.option_2}</td>
              <td>{question.option_3}</td>
              <td>{question.answer}</td>
              <td>
                <button onClick={() => handleEditButtonClick(question)}>Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingQuestion && (
        <div className="edit-form">
          <h2>Edit Question</h2>
          <form onSubmit={handleFormSubmit}>
            <div>
              <label>Question Text:</label>
              <input type="text" name="question_text" value={editedQuestion.question_text} onChange={handleInputChange} />
            </div>
            <div>
              <label>Option 1:</label>
              <input type="text" name="option_1" value={editedQuestion.option_1} onChange={handleInputChange} />
            </div>
            <div>
              <label>Option 2:</label>
              <input type="text" name="option_2" value={editedQuestion.option_2} onChange={handleInputChange} />
            </div>
            <div>
              <label>Option 3:</label>
              <input type="text" name="option_3" value={editedQuestion.option_3} onChange={handleInputChange} />
            </div>
            <div>
              <label>Answer:</label>
              <input type="text" name="answer" value={editedQuestion.answer} onChange={handleInputChange} />
            </div>
            <button type="submit">Save</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default QuizTable;
