import './Welcome.css';
import React, { useState, useEffect, useContext } from "react";
import Footer from '../../Components/Footer';
import UserContext from "../../Components/UserContext";
import { Link, useNavigate, useLocation } from 'react-router-dom';

const QuizInstructions = () => {
  const [username, setUsername] = useState("");
  const { userData } = useContext(UserContext); // Get user data from context
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const addFakeEntryToHistory = () => {
      window.history.pushState(null, null, location.pathname);
    };

    const handlePopState = (event) => {
      event.preventDefault();
      addFakeEntryToHistory();
      navigate(location.pathname, { replace: true });
    };

    addFakeEntryToHistory();
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname, navigate]);

  const handleSubjectClick = (subject, event) => {
    event.preventDefault();
    // Navigate to the specified quiz page
    navigate(`/quiz/${subject}`);
  };

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch("http://localhost:5000/fetchUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userData.email }), // Use email from context
        });
        const data = await response.json();

        if (data.success) {
          setUsername(data.username);
        } else {
          console.error("Failed to fetch username:", data.message);
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    if (userData.email) {
      fetchUsername();
    }
  }, [userData.email]);

  return (
    <>
      <div className='qbg'>
        <nav className="navbar navbar-expand-lg navbar-light bg-dark mx-auto">
          <a className="navbar-brand" style={{ color: '#ffffff' }} href="#">Subjects</a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" style={{ color: '#ffffff' }} href="#" onClick={(e) => handleSubjectClick('html', e)}>HTML</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" style={{ color: '#ffffff' }} href="#" onClick={(e) => handleSubjectClick('css', e)}>CSS</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" style={{ color: '#ffffff' }} href="#" onClick={(e) => handleSubjectClick('javascript', e)}>JavaScript</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" style={{ color: '#ffffff' }} href="#" onClick={(e) => handleSubjectClick('bootstrap', e)}>Bootstrap</a>
              </li>
            </ul>
            <div className="ml-auto d-flex align-items-center">
              <h6 style={{ margin: 0, color: '#ffffff' }}>Welcome, {username || 'user'}!</h6>
              <Link to="/login"><button className="custom-button ml-3 mr-2">Sign Out</button></Link>
            </div>
          </div>
        </nav>
        <h1 style={{ paddingTop: '20px', textAlign: 'center', color: 'rgb(97, 97, 97)',fontFamily: 'cursive' , fontStyle: 'italic' }}>Quiz Instructions</h1>
        <div className="p" style={{ marginLeft: '100px', marginRight: '100px', marginTop: '30px', fontSize: '20px', fontStyle: 'italic' }}>
          <ul>
            <li>The quizzes consists of questions carefully designed to help you self-assess your comprehension of the information presented on the topics covered in the module. No data will be collected on the website regarding your responses or how many times you take the quiz.</li>
            <li>Each question in the quiz is of multiple-choice or "true or false" format. Read each question carefully, and click on the button next to your response that is based on the information covered on the topic in the module. Each correct or incorrect response will result in appropriate feedback immediately at the bottom of the screen.</li>
            <li>After responding to a question, click on the "Next Question" button at the bottom to go to the next question. After responding to the 8th question, click on "Close" on the top of the window to exit the quiz.</li>
            <li>If you select an incorrect response for a question, you can try again until you get the correct response. If you retake the quiz, the questions and their respective responses will be randomized.</li>
            <li>The total score for the quiz is based on your responses to all questions. If you respond incorrectly to a question or retake a question again and get the correct response, your quiz score will reflect it appropriately. However, your quiz will not be graded, if you skip a question or exit before responding to all the questions.</li>
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default QuizInstructions;
