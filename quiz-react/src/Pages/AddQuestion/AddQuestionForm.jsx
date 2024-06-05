import React, { useState } from 'react';
import './style.css'; // Make sure to import your CSS file

function AddQuestionForm() {
  const [formData, setFormData] = useState({
    subject: 'HTML',
    question: '',
    option1: '',
    option2: '',
    option3: '',
    answer: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { subject, question, option1, option2, option3, answer } = formData;

    if (!question || !option1 || !option2 || !option3 || !answer) {
      alert('Please fill in all fields.');
      return;
    }

    const formDataToSend = {
      subject: subject,
      question: question.trim(),
      options: [option1.trim(), option2.trim(), option3.trim()],
      answer: answer.trim()
    };

    try {
      const response = await fetch('http://localhost:5000/api/addQuestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataToSend)
      });

      if (!response.ok) {
        throw new Error('Failed to add question to database');
      }

      // Display popup message if the question is added successfully
      alert('Question added successfully!');

      // Clear form fields after successful submission
      setFormData({
        subject: 'HTML',
        question: '',
        option1: '',
        option2: '',
        option3: '',
        answer: ''
      });
    } catch (error) {
      console.error('Error adding question:', error);
      alert('Error adding question. Please try again later.');
    }
  };

  return (
    <div className='bg6'>
    <div className="container">
      <h2 style={{ fontFamily: 'cursive', fontSize: '40px', fontWeight: 800, color: 'rgb(119, 117, 117)' }}>Add Questions</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="subject">Select Subject:</label>
        <select id="subject" name="subject" value={formData.subject} onChange={handleChange}>
          <option value="HTML">HTML</option>
          <option value="CSS">CSS</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Bootstrap">Bootstrap</option>
        </select><br /><br />

        <label htmlFor="question">Question:</label><br />
        <textarea id="question" name="question" value={formData.question} onChange={handleChange} rows="4" cols="50"></textarea><br /><br />

        <label htmlFor="option1">Option 1:</label><br />
        <input type="text" id="option1" name="option1" value={formData.option1} onChange={handleChange} /><br /><br />

        <label htmlFor="option2">Option 2:</label><br />
        <input type="text" id="option2" name="option2" value={formData.option2} onChange={handleChange} /><br /><br />

        <label htmlFor="option3">Option 3:</label><br />
        <input type="text" id="option3" name="option3" value={formData.option3} onChange={handleChange} /><br /><br />

        <label htmlFor="answer">Answer:</label><br />
        <input type="text" id="answer" name="answer" value={formData.answer} onChange={handleChange} /><br /><br />

       
      </form>
     
    </div>
     <center><button type="submit">Submit</button></center>
     </div>
  );
}

export default AddQuestionForm;





